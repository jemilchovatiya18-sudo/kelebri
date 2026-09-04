// Quick configuration checker
require('dotenv').config();

console.log('\n🔍 Checking Kelebri Backend Configuration...\n');

const checks = [
  { name: 'PORT', value: process.env.PORT, required: false },
  { name: 'MONGODB_URI', value: process.env.MONGODB_URI, required: true },
  { name: 'JWT_SECRET', value: process.env.JWT_SECRET, required: true },
  { name: 'CLOUDINARY_CLOUD_NAME', value: process.env.CLOUDINARY_CLOUD_NAME, required: true },
  { name: 'CLOUDINARY_API_KEY', value: process.env.CLOUDINARY_API_KEY, required: true },
  { name: 'CLOUDINARY_API_SECRET', value: process.env.CLOUDINARY_API_SECRET, required: true },
  { name: 'FRONTEND_URL', value: process.env.FRONTEND_URL, required: false },
];

let hasErrors = false;

checks.forEach(check => {
  const isSet = check.value && check.value !== `your_${check.name.toLowerCase()}` && check.value !== 'your_cloud_name' && check.value !== 'your_api_key' && check.value !== 'your_api_secret';
  
  if (check.required && !isSet) {
    console.log(`❌ ${check.name}: NOT CONFIGURED`);
    hasErrors = true;
  } else if (isSet) {
    const maskedValue = check.name.includes('SECRET') || check.name.includes('KEY') 
      ? '***' + check.value.slice(-4)
      : check.value;
    console.log(`✅ ${check.name}: ${maskedValue}`);
  } else {
    console.log(`⚠️  ${check.name}: Using default`);
  }
});

console.log('\n');

if (hasErrors) {
  console.log('⚠️  CLOUDINARY NOT CONFIGURED!');
  console.log('📖 Please read CLOUDINARY_SETUP.md for instructions\n');
  console.log('Quick steps:');
  console.log('1. Sign up at https://cloudinary.com');
  console.log('2. Get your credentials from the dashboard');
  console.log('3. Update backend/.env file');
  console.log('4. Restart the server\n');
  process.exit(1);
} else {
  console.log('✨ All configurations look good!\n');
  process.exit(0);
}
