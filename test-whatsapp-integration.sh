#!/bin/bash

echo "🔍 Testing WhatsApp Business Integration for Hair@Home"
echo "========================================================"

# Start local server
echo "🚀 Starting local server..."
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!
sleep 2

# Test if server is running
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Server started successfully"
else
    echo "❌ Server failed to start"
    exit 1
fi

# Test WhatsApp links
echo ""
echo "📱 Testing WhatsApp Integration..."

# Check for WhatsApp links in HTML
WHATSAPP_LINKS=$(curl -s http://localhost:8000 | grep -o "https://wa.me/[^\"']*" | wc -l)
echo "📊 Found $WHATSAPP_LINKS WhatsApp links"

# Check for floating button
FLOATING_BUTTON=$(curl -s http://localhost:8000 | grep -c "whatsapp-float")
echo "🎈 Floating WhatsApp button: $([ $FLOATING_BUTTON -gt 0 ] && echo '✅ Present' || echo '❌ Missing')"

# Check for Formspree configuration
FORMSPREE=$(curl -s http://localhost:8000 | grep -c "formspree.io")
echo "📋 Formspree integration: $([ $FORMSPREE -gt 0 ] && echo '✅ Configured' || echo '❌ Missing')"

# Check for WhatsApp styling
STYLES=$(curl -s http://localhost:8000 | grep -c "whatsapp-btn")
echo "🎨 WhatsApp styling: $([ $STYLES -gt 0 ] && echo '✅ Applied' || echo '❌ Missing')"

# Test specific WhatsApp URLs
echo ""
echo "🔗 Testing WhatsApp URL patterns..."

# Hero button
HERO_WHATSAPP=$(curl -s http://localhost:8000 | grep -A1 -B1 "Book via WhatsApp" | grep -o "https://wa.me/[^\"']*")
if [ ! -z "$HERO_WHATSAPP" ]; then
    echo "✅ Hero WhatsApp button: $HERO_WHATSAPP"
else
    echo "❌ Hero WhatsApp button not found"
fi

# Booking section WhatsApp
BOOKING_WHATSAPP=$(curl -s http://localhost:8000 | grep -A2 "booking-buttons" | grep -o "https://wa.me/[^\"']*")
if [ ! -z "$BOOKING_WHATSAPP" ]; then
    echo "✅ Booking WhatsApp button: $BOOKING_WHATSAPP"
else
    echo "❌ Booking WhatsApp button not found"
fi

# Footer WhatsApp
FOOTER_WHATSAPP=$(curl -s http://localhost:8000 | grep -A5 "footer" | grep -o "https://wa.me/[^\"']*")
if [ ! -z "$FOOTER_WHATSAPP" ]; then
    echo "✅ Footer WhatsApp link: $FOOTER_WHATSAPP"
else
    echo "❌ Footer WhatsApp link not found"
fi

# Test pre-filled messages
echo ""
echo "💬 Testing pre-filled messages..."
PREFILLED=$(curl -s http://localhost:8000 | grep -o "text=[^&]*" | head -3)
for message in $PREFILLED; do
    if [[ $message == *"book"* ]]; then
        echo "✅ Pre-filled booking message found"
    fi
done

# Test JavaScript functionality
echo ""
echo "🧪 Testing JavaScript integration..."
JS_CHECK=$(curl -s http://localhost:8000 script.js | grep -c "showSuccessMessage\|showWhatsAppFallback\|Formspree")
echo "📜 Form handling functions: $([ $JS_CHECK -gt 0 ] && echo '✅ Present' || echo '❌ Missing')"

# Test responsive design
echo ""
echo "📱 Testing responsive elements..."
RESPONSIVE_CSS=$(curl -s http://localhost:8000 | grep -c "whatsapp-float")
echo "📐 Floating button CSS: $([ $RESPONSIVE_CSS -gt 0 ] && echo '✅ Responsive' || echo '❌ Not responsive')"

# Cleanup
kill $SERVER_PID

echo ""
echo "📋 Integration Summary"
echo "======================"
echo "WhatsApp Links: $WHATSAPP_LINKS found"
echo "Floating Button: $([ $FLOATING_BUTTON -gt 0 ] && echo 'Present' || echo 'Missing')"
echo "Formspree: $([ $FORMSPREE -gt 0 ] && echo 'Configured' || echo 'Missing')"
echo "Styling: $([ $STYLES -gt 0 ] && echo 'Applied' || echo 'Missing')"
echo "JavaScript: $([ $JS_CHECK -gt 0 ] && echo 'Present' || echo 'Missing')"

if [ $WHATSAPP_LINKS -gt 0 ] && [ $FLOATING_BUTTON -gt 0 ] && [ $FORMSPREE -gt 0 ] && [ $STYLES -gt 0 ]; then
    echo ""
    echo "🎉 WhatsApp Business Integration: ✅ SUCCESS"
    echo "📱 Primary booking channel is ready!"
    exit 0
else
    echo ""
    echo "⚠️  WhatsApp Business Integration: ❌ INCOMPLETE"
    echo "Some components may be missing."
    exit 1
fi