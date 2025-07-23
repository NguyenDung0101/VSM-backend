"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@vsm.org.vn';
    const adminPassword = 'admin123456';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await prisma.user.create({
            data: {
                name: 'VSM Administrator',
                email: adminEmail,
                password: hashedPassword,
                role: client_1.Role.ADMIN,
                isActive: true,
            },
        });
        console.log('✅ Tài khoản Admin đã được tạo:');
        console.log('📧 Email:', adminEmail);
        console.log('�� Password:', adminPassword);
        console.log('👤 ID:', admin.id);
    }
    else {
        console.log('ℹ️ Tài khoản Admin đã tồn tại:', adminEmail);
    }
    const editorEmail = 'editor@vsm.org.vn';
    const editorPassword = 'editor123456';
    const existingEditor = await prisma.user.findUnique({
        where: { email: editorEmail },
    });
    if (!existingEditor) {
        const hashedPassword = await bcrypt.hash(editorPassword, 10);
        const editor = await prisma.user.create({
            data: {
                name: 'VSM Editor',
                email: editorEmail,
                password: hashedPassword,
                role: client_1.Role.EDITOR,
                isActive: true,
            },
        });
        console.log('✅ Tài khoản Editor mẫu đã được tạo:');
        console.log('📧 Email:', editorEmail);
        console.log('🔑 Password:', editorPassword);
        console.log('👤 ID:', editor.id);
    }
    else {
        console.log('ℹ️ Tài khoản Editor đã tồn tại:', editorEmail);
    }
    const userEmail = 'user@vsm.org.vn';
    const userPassword = 'user123456';
    const existingUser = await prisma.user.findUnique({
        where: { email: userEmail },
    });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await prisma.user.create({
            data: {
                name: 'VSM User',
                email: userEmail,
                password: hashedPassword,
                role: client_1.Role.USER,
                isActive: true,
            },
        });
        console.log('✅ Tài khoản User mẫu đã được tạo:');
        console.log('📧 Email:', userEmail);
        console.log('🔑 Password:', userPassword);
        console.log('👤 ID:', user.id);
    }
    else {
        console.log('ℹ️ Tài khoản User đã tồn tại:', userEmail);
    }
    console.log('🎉 Seed completed!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map