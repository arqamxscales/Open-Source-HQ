#!/usr/bin/env python3
"""
Test script for Fraud Detection Dashboard API
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_api():
    print("🧪 Testing Fraud Detection Dashboard API...\n")
    
    # Test 1: Health check
    print("1️⃣  Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 2: Dashboard Overview
    print("2️⃣  Testing Dashboard Overview...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/overview")
        data = response.json()
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Total Transactions: {data['total_transactions']}")
        print(f"   Fraud Cases: {data['fraud_cases']}")
        print(f"   AI Accuracy: {data['ai_accuracy']}%\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 3: Get Alerts
    print("3️⃣  Testing Alerts Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/alerts")
        alerts = response.json()
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Active Alerts: {len(alerts)}")
        if alerts:
            print(f"   First Alert: {alerts[0]['description']}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 4: Get Cities
    print("4️⃣  Testing Cities Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/cities")
        cities = response.json()
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Cities in Database: {len(cities)}")
        for city in cities[:2]:
            print(f"      - {city['city']}: {city['fraudulent']} frauds")
        print()
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 5: Fraud Detection
    print("5️⃣  Testing Fraud Detection...")
    try:
        transaction = {
            "amount": 250000,
            "hour": 23,
            "location_change": True,
            "new_merchant": False
        }
        response = requests.post(f"{BASE_URL}/api/detect-fraud", json=transaction)
        result = response.json()
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Transaction Amount: PKR {transaction['amount']:,}")
        print(f"   Hour: {transaction['hour']}:00")
        print(f"   Is Fraud: {result['is_fraud']}")
        print(f"   Risk Score: {result['risk_score']}/100\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 6: ML Metrics
    print("6️⃣  Testing ML Metrics...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/ml-metrics")
        data = response.json()
        print(f"   ✅ Status: {response.status_code}")
        metrics = data['metrics']
        for metric in metrics[:2]:
            print(f"      - {metric['metric']}: {metric['current']}% (Target: {metric['target']}%)")
        print()
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 7: Analytics Summary
    print("7️⃣  Testing Analytics Summary...")
    try:
        response = requests.get(f"{BASE_URL}/api/analytics/summary")
        data = response.json()
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Fraud Rate: {data['fraud_rate']}%")
        print(f"   Prevented Loss: PKR {data['prevented_loss']}M")
        print(f"   Active Alerts: {data['active_alerts']}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    print("✅ All API tests completed!")

if __name__ == "__main__":
    test_api()
