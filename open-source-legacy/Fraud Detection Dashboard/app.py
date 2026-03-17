from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import random
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# Simulated fraud detection data
class FraudDetectionSystem:
    def __init__(self):
        self.cities = {
            'Karachi': {'transactions': 12695, 'frauds': 245},
            'Lahore': {'transactions': 10428, 'frauds': 198},
            'Islamabad': {'transactions': 9056, 'frauds': 156},
            'Rawalpindi': {'transactions': 7784, 'frauds': 134},
            'Faisalabad': {'transactions': 5509, 'frauds': 89},
            'Multan': {'transactions': 4297, 'frauds': 67},
        }
        
        self.fraud_types = {
            'Card Not Present': {'count': 389, 'color': '#ef4444'},
            'Account Takeover': {'count': 267, 'color': '#f97316'},
            'Identity Theft': {'count': 234, 'color': '#eab308'},
            'Phishing': {'count': 178, 'color': '#84cc16'},
            'ATM Skimming': {'count': 145, 'color': '#06b6d4'},
            'Other': {'count': 98, 'color': '#8b5cf6'},
        }
        
        self.alerts = [
            {'id': 1, 'time': '2 min ago', 'type': 'High Risk', 'description': 'Multiple transactions from Karachi - PKR 250K', 'status': 'investigating', 'severity': 'critical'},
            {'id': 2, 'time': '8 min ago', 'type': 'Velocity', 'description': '5 transactions in 3 minutes', 'status': 'blocked', 'severity': 'critical'},
            {'id': 3, 'time': '15 min ago', 'type': 'Location', 'description': 'Card used in Lahore & Dubai within 1 hour', 'status': 'flagged', 'severity': 'warning'},
            {'id': 4, 'time': '23 min ago', 'type': 'Amount', 'description': 'Transaction PKR 500K - New merchant', 'status': 'reviewing', 'severity': 'warning'},
        ]

    def get_monthly_trend(self):
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return [{
            'month': month,
            'frauds': random.randint(130, 240),
            'prevented': random.randint(100, 200)
        } for month in months]

    def get_hourly_pattern(self):
        hours = ['00-03', '03-06', '06-09', '09-12', '12-15', '15-18', '18-21', '21-00']
        return [{
            'hour': hour,
            'frauds': random.randint(40, 160),
            'normal': random.randint(1000, 4000)
        } for hour in hours]

    def get_customer_segments(self):
        segments = [
            {'segment': 'Premium', 'customers': 15000, 'fraudRate': 0.8, 'avgLoss': 78000},
            {'segment': 'Business', 'customers': 8500, 'fraudRate': 2.1, 'avgLoss': 125000},
            {'segment': 'Regular', 'customers': 45000, 'fraudRate': 1.5, 'avgLoss': 28000},
            {'segment': 'Student', 'customers': 12000, 'fraudRate': 1.2, 'avgLoss': 15000},
        ]
        return segments

    def get_ml_metrics(self):
        return [
            {'metric': 'Accuracy', 'current': 94.7, 'target': 95.0},
            {'metric': 'Precision', 'current': 91.2, 'target': 92.0},
            {'metric': 'Recall', 'current': 87.3, 'target': 90.0},
            {'metric': 'F1-Score', 'current': 89.2, 'target': 91.0},
            {'metric': 'AUC-ROC', 'current': 96.5, 'target': 97.0},
        ]

    def get_feature_importance(self):
        return [
            {'feature': 'Transaction Amount', 'importance': 28},
            {'feature': 'Time of Day', 'importance': 22},
            {'feature': 'Location Change', 'importance': 18},
            {'feature': 'Frequency', 'importance': 15},
            {'feature': 'Device Change', 'importance': 12},
            {'feature': 'Merchant Type', 'importance': 5},
        ]

    def detect_fraud(self, transaction):
        """Simple fraud detection logic"""
        amount = transaction.get('amount', 0)
        hour = transaction.get('hour', 12)
        location_change = transaction.get('location_change', False)
        new_merchant = transaction.get('new_merchant', False)
        
        risk_score = 0
        
        # Amount-based risk
        if amount > 100000:
            risk_score += 25
        elif amount > 50000:
            risk_score += 15
            
        # Time-based risk (high fraud between 21-6)
        if hour >= 21 or hour < 6:
            risk_score += 20
            
        # Location change risk
        if location_change:
            risk_score += 30
            
        # New merchant risk
        if new_merchant:
            risk_score += 25
            
        is_fraud = risk_score > 50
        return {
            'is_fraud': is_fraud,
            'risk_score': min(100, risk_score),
            'reasons': []
        }

fraud_system = FraudDetectionSystem()

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/dashboard/overview')
def dashboard_overview():
    return jsonify({
        'total_transactions': 156789,
        'fraud_cases': 1311,
        'fraud_rate': 1.83,
        'prevented_loss': 'PKR 23.4M',
        'ai_accuracy': 87.3,
        'response_time': 1.2,
        'monthly_trend': fraud_system.get_monthly_trend(),
        'fraud_types': fraud_system.fraud_types
    })

@app.route('/api/dashboard/cities')
def dashboard_cities():
    cities_list = []
    for city, data in fraud_system.cities.items():
        fraud_rate = (data['frauds'] / data['transactions']) * 100
        cities_list.append({
            'city': city,
            'total': data['transactions'],
            'fraudulent': data['frauds'],
            'rate': round(fraud_rate, 2)
        })
    return jsonify(cities_list)

@app.route('/api/dashboard/patterns')
def dashboard_patterns():
    return jsonify({
        'hourly': fraud_system.get_hourly_pattern(),
        'daily': [
            {'day': 'Monday', 'frauds': 185, 'normal': 8900},
            {'day': 'Tuesday', 'frauds': 192, 'normal': 9200},
            {'day': 'Wednesday', 'frauds': 178, 'normal': 8700},
            {'day': 'Thursday', 'frauds': 195, 'normal': 9100},
            {'day': 'Friday', 'frauds': 210, 'normal': 9500},
            {'day': 'Saturday', 'frauds': 156, 'normal': 7800},
            {'day': 'Sunday', 'frauds': 148, 'normal': 7200},
        ]
    })

@app.route('/api/dashboard/customers')
def dashboard_customers():
    return jsonify(fraud_system.get_customer_segments())

@app.route('/api/dashboard/ml-metrics')
def dashboard_ml_metrics():
    return jsonify({
        'metrics': fraud_system.get_ml_metrics(),
        'feature_importance': fraud_system.get_feature_importance()
    })

@app.route('/api/alerts')
def get_alerts():
    return jsonify(fraud_system.alerts)

@app.route('/api/alerts/add', methods=['POST'])
def add_alert():
    data = request.json
    new_alert = {
        'id': len(fraud_system.alerts) + 1,
        'time': 'just now',
        'type': data.get('type', 'Alert'),
        'description': data.get('description', ''),
        'status': 'new',
        'severity': data.get('severity', 'info')
    }
    fraud_system.alerts.insert(0, new_alert)
    return jsonify({'success': True, 'alert': new_alert}), 201

@app.route('/api/detect-fraud', methods=['POST'])
def detect_fraud():
    transaction = request.json
    result = fraud_system.detect_fraud(transaction)
    return jsonify(result)

@app.route('/api/analytics/summary')
def analytics_summary():
    return jsonify({
        'total_transactions': 156789,
        'total_frauds': 1311,
        'fraud_rate': 1.83,
        'prevented_loss': 23.4,  # in millions
        'avg_detection_time': 1.2,
        'model_accuracy': 87.3,
        'model_precision': 91.2,
        'model_recall': 87.3,
        'active_alerts': len([a for a in fraud_system.alerts if a['status'] in ['investigating', 'reviewing']]),
        'blocked_transactions': sum(1 for a in fraud_system.alerts if a['status'] == 'blocked')
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
