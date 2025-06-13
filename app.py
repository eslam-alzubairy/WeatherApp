
from flask import Flask, render_template, request, jsonify
import requests

# 2. تهيئة تطبيق فلاسك
app = Flask(__name__)

# 3. وضع المتغيرات الثابتة
API_KEY = 'aab212a9e498dc379d7483115eccafc7'
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

# --- تعريف المسارات (Routes) ---

@app.route('/')
def index():
    return render_template('index.html')

# المسار الخاص بجلب بيانات الطقس (/weather)
@app.route('/weather')
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "اسم المدينة مطلوب"}), 400

    params = {
        'q': city,
        'appid': API_KEY,
        'units': 'metric',
        'lang': 'ar'
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status() 
        
        weather_data = response.json()

        processed_data = {
            "city": weather_data["name"],
            "temperature": round(weather_data["main"]["temp"]),
            "description": weather_data["weather"][0]["description"],
            "icon": weather_data["weather"][0]["icon"],
            "humidity": weather_data["main"]["humidity"],
            "wind_speed": round(weather_data["wind"]["speed"] * 3.6) 
        }
        
        return jsonify(processed_data)

    except requests.exceptions.HTTPError as err:
        if err.response.status_code == 404:
            return jsonify({"error": "لم يتم العثور على المدينة. يرجى التحقق من الاسم."}), 404
        else:
            return jsonify({"error": "حدث خطأ أثناء الاتصال بخدمة الطقس."}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "حدث خطأ غير متوقع في الخادم."}), 500

# --- تشغيل التطبيق ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)