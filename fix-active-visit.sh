#!/bin/bash

# ✅ Script لحل مشكلة الزيارة المعلقة

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 إصلاح مشكلة الزيارة النشطة"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# الانتقال لمجلد Backend
cd /home/aghar/Desktop/CureDashbord/dashboard/var/www/html

echo "📊 فحص الزيارات النشطة..."
echo ""

# تشغيل PHP script لفحص وإصلاح الزيارات
php artisan tinker << 'EOF'
// فحص الزيارات النشطة
$activeVisits = \App\Models\MedicalVisit::whereNull('end_visit')->get();

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "📊 عدد الزيارات النشطة: " . $activeVisits->count() . "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

if ($activeVisits->count() > 0) {
    echo "🔍 تفاصيل الزيارات النشطة:\n\n";
    
    foreach ($activeVisits as $visit) {
        echo "Visit ID: " . $visit->id . "\n";
        echo "Medical ID: " . $visit->medical_id . "\n";
        echo "Doctor ID: " . $visit->doctor_id . "\n";
        echo "Start: " . $visit->start_visit . "\n";
        echo "Created: " . $visit->created_at . "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    }
    
    // إنهاء كل الزيارات النشطة
    echo "✅ إنهاء جميع الزيارات النشطة...\n";
    
    $count = \App\Models\MedicalVisit::whereNull('end_visit')
        ->update([
            'end_visit' => now(),
            'end_visit_latitude' => DB::raw('start_visit_latitude'),
            'end_visit_longitude' => DB::raw('start_visit_longitude')
        ]);
    
    echo "✅ تم إنهاء $count زيارة بنجاح!\n\n";
} else {
    echo "✓ لا توجد زيارات نشطة!\n\n";
}

// تنظيف cache
echo "🧹 تنظيف الـ cache...\n";
EOF

# تنظيف cache Laravel
php artisan cache:clear
php artisan config:clear

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ اكتمل الإصلاح!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 الآن:"
echo "   1. أغلق التطبيق وافتحه مرة أخرى"
echo "   2. أو اسحب للأسفل (Pull to Refresh)"
echo "   3. جرب إضافة زيارة جديدة"
echo ""

