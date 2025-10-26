#!/bin/bash

echo "🚀 رفع المشروع على GitHub"
echo "================================"
echo ""

# تحقق من وجود رابط GitHub
if [ -z "$1" ]; then
    echo "❌ الرجاء إدخال رابط Repository من GitHub"
    echo ""
    echo "الاستخدام:"
    echo "  ./upload-to-github.sh https://github.com/username/repo.git"
    echo ""
    exit 1
fi

GITHUB_REPO=$1

echo "📦 إضافة الملفات..."
git add .

echo "💾 حفظ التغييرات..."
git commit -m "Initial commit: School Management System" || echo "لا توجد تغييرات جديدة"

echo "🔗 ربط المشروع بـ GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin $GITHUB_REPO

echo "⬆️  رفع الملفات إلى GitHub..."
git push -u origin main || git push -u origin master

echo ""
echo "✅ ================================"
echo "✅  تم رفع المشروع بنجاح! 🎉"
echo "✅ ================================"
echo ""
echo "🌐 رابط المشروع: $GITHUB_REPO"
echo ""
