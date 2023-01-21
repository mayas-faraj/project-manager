"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        yield prisma.suspend.deleteMany({});
        yield prisma.payment.deleteMany({});
        yield prisma.media.deleteMany({});
        yield prisma.project.deleteMany({});
        yield prisma.user.deleteMany({});
        result = yield prisma.user.createMany({
            data: [
                {
                    id: 1,
                    name: 'administrator',
                    password: 'bc46ab36ba8e55b77465205466c998445bf59e43e86404a1533f127baaf0295d63c4d01852119a880fcf92bcd2425ec926224a661e906882c8df20c67e3ba994',
                    avatar: '/imgs/users/admin.png',
                    role: 'ADMIN'
                },
                {
                    id: 2,
                    name: 'zaher',
                    password: 'ea351821f0d58296fc3eba8591fa199a435e4ddfe4d988f56c1cac694533854197ede24392ef3ced8db82bbd46c407768b7875cc845b31065b4ae814fdc09a85',
                    avatar: '/imgs/users/zaher.png',
                    role: 'PROJECT_MANAGER'
                },
                {
                    id: 3,
                    name: 'mayas',
                    password: '3505ac73417d654c0f22ede988f6e4fcb4108eecc35b2aafcd722fae9c121223bbdb6f728bdd913246dfa120df595183d811578a549458a2bbfdd8f5f405b556',
                    avatar: '/imgs/users/mayas.png',
                    role: 'VIEWER'
                }
            ]
        });
        console.log(result);
        result = yield prisma.project.create({
            data: {
                name: 'نقابة المهندسين',
                remark: 'مشروع اعادة نقابة المهنسين العراقيين',
                duration: 450,
                cost: 1600000000,
                amountPaid: 400000000,
                longitude: 44.309062,
                latitude: 32.041784,
                status: 'WORKING',
                avatar: '/imgs/projects/project1-1.jpg',
                companyName: 'الشركة المتحدة',
                creatorId: 1,
                engineerName: 'لؤي صوان',
                engineerPhone: '0933445566',
                engineerDepartment: 'قسم الدراسات الفنية',
                extensions: {
                    createMany: {
                        data: [
                            {
                                byDuration: 30,
                                description: 'تمديد اولي',
                                documentUrl: '/docs/doc1.docx',
                                creatorId: 1
                            }
                        ]
                    }
                },
                media: {
                    createMany: {
                        data: [
                            { src: '/imgs/projects/project1-2.jpg', title: 'واجهة البناء', creatorId: 1, orderIndex: 1 },
                            { src: '/imgs/projects/project1-3.jpg', title: 'منظر جانبي', creatorId: 1, orderIndex: 2 }
                        ]
                    }
                },
                payments: {
                    createMany: {
                        data: [
                            { amount: 1600000, description: 'دفعة اولى', creatorId: 1 },
                            { amount: 1200000, description: 'دفعة ثانية', creatorId: 1 },
                            { amount: 1600000, description: 'دفعة ثالثة', creatorId: 1 },
                            { amount: 1400000, description: 'دفعة رابعة', creatorId: 1 }
                        ]
                    }
                },
                suspends: {
                    createMany: {
                        data: [
                            {
                                fromDate: new Date(2023, 1, 15),
                                toDate: new Date(2023, 2, 12),
                                documentUrl: '/docs/doc-s-1.docx',
                                description: 'نقص مواد',
                                creatorId: 1
                            },
                            {
                                fromDate: new Date(2023, 4, 25),
                                toDate: new Date(2023, 6, 1),
                                documentUrl: '/docs/doc-s-2.docx',
                                description: 'ظروف جوية سيئة',
                                creatorId: 1
                            }
                        ]
                    }
                }
            }
        });
        console.log(result);
        result = yield prisma.project.create({
            data: {
                name: 'ملعب الاتحاد',
                remark: 'ملعب كرة قدم',
                duration: 450,
                cost: 1100000000,
                amountPaid: 340000000,
                longitude: 44.309162,
                latitude: 32.041284,
                status: 'WORKING',
                creatorId: 2,
                avatar: '/imgs/projects/project2-1.jpg',
                companyName: 'شركة الأفق الدولية',
                engineerName: 'حسان الثابت',
                engineerPhone: '0933123123',
                engineerDepartment: 'قسم البحوث العلمية',
                extensions: {
                    createMany: {
                        data: [
                            {
                                byDuration: 22,
                                description: 'تمديد غير مشروع',
                                documentUrl: '/docs/doc2.docx',
                                creatorId: 1
                            },
                            {
                                byDuration: 17,
                                description: 'تمديد بسبب الاحوال الجوية',
                                documentUrl: '/docs/doc3.docx',
                                creatorId: 1
                            }
                        ]
                    }
                },
                media: {
                    createMany: {
                        data: [
                            { src: '/imgs/projects/project2-1.png', title: 'منظر علوي', creatorId: 2 },
                            { src: '/imgs/projects/project2-2.png', title: 'منظر جانبي', creatorId: 2 }
                        ]
                    }
                },
                payments: {
                    createMany: {
                        data: [
                            { amount: 900000, description: 'دفعة اولية', creatorId: 2 },
                            { amount: 1200000, description: 'دفعة اضافية', creatorId: 2 },
                            { amount: 1000000, description: 'دفعة مع شراء مواد', creatorId: 2 },
                            { amount: 800000, description: 'دفعة بشكل فوري', creatorId: 3 }
                        ]
                    }
                },
                suspends: {
                    createMany: {
                        data: [
                            {
                                fromDate: new Date(2023, 5, 5),
                                toDate: new Date(2023, 7, 11),
                                documentUrl: '/docs/doc-s-3.docx',
                                description: 'تسريح عدد كبير من موظفي الشركة',
                                creatorId: 1
                            }
                        ]
                    }
                }
            }
        });
        console.log(result);
        result = yield prisma.project.create({
            data: {
                name: 'ساحة الحياة',
                remark: 'ساحة وسط المحافظة مزودة بنوافير لضخ المياة وحديقة ازهار',
                duration: 250,
                cost: 200000000,
                amountPaid: 100000000,
                longitude: 44.309062,
                latitude: 32.041784,
                status: 'LATE',
                avatar: '/imgs/projects/project3-1.jpg',
                companyName: 'شركة جلجامش',
                creatorId: 2,
                engineerName: 'علي الاسمر',
                engineerPhone: '09656578',
                engineerDepartment: 'دائرة التعمير',
                media: {
                    createMany: {
                        data: [
                            { src: '/imgs/projects/project3-2.png', title: 'المنظر العلوي', creatorId: 1 },
                            { src: '/imgs/projects/project3-3.png', title: 'من ساحة الحياة', creatorId: 1 }
                        ]
                    }
                },
                payments: {
                    createMany: {
                        data: [
                            { amount: 5000000, description: 'دفعة اولية', creatorId: 1 },
                            { amount: 2000000, description: 'تكملة الدفعة الاولية', creatorId: 1 }
                        ]
                    }
                },
                suspends: {
                    createMany: {
                        data: [
                            {
                                fromDate: new Date(2023, 1, 12),
                                toDate: new Date(2023, 3, 12),
                                description: 'عدم توفر المواد الاولية',
                                documentUrl: '/docs/doc-s-4.docx',
                                creatorId: 1
                            },
                            {
                                fromDate: new Date(2023, 3, 15),
                                toDate: new Date(2023, 4, 1),
                                description: 'تغير سعر الصرف',
                                documentUrl: '/docs/doc-s-5.docx',
                                creatorId: 1
                            },
                            {
                                fromDate: new Date(2023, 4, 15),
                                toDate: new Date(2023, 6, 12),
                                description: 'توقف قانوني',
                                creatorId: 1
                            }
                        ]
                    }
                }
            }
        });
        console.log(result);
        result = yield prisma.project.create({
            data: {
                name: 'مشفى الامل',
                remark: 'مشفى عامل لعلاج جميع الامراض',
                duration: 180,
                cost: 1200000000,
                amountPaid: 400000000,
                longitude: 44.302062,
                latitude: 32.041384,
                status: 'WORKING',
                avatar: '/imgs/projects/project4-1.jpg',
                companyName: 'شركة تعمير العراق',
                creatorId: 1,
                engineerName: 'عادل الحموي',
                engineerPhone: '09776655',
                engineerDepartment: 'دائرة الهندسة المعمارية',
                media: {
                    createMany: {
                        data: [
                            { src: '/imgs/projects/project4-2.png', title: 'منظر رئيسي', creatorId: 2 },
                            { src: '/imgs/projects/project4-3.png', title: '', creatorId: 2 }
                        ]
                    }
                },
                payments: {
                    createMany: {
                        data: [
                            { amount: 1000000, description: 'افتتاح المشروع', creatorId: 2 },
                            { amount: 3000000, description: 'بناء الجوائز', creatorId: 2 },
                            { amount: 4000000, description: '', creatorId: 2 }
                        ]
                    }
                }
            }
        });
        console.log(result);
        result = yield prisma.project.create({
            data: {
                name: 'مدرسة التفوق للمتميزين',
                remark: 'مدرسة نموذجية للمتفوقين في الشهادة الاعدادية بكافة فروعها',
                duration: 400,
                cost: 1350000000,
                amountPaid: 350000000,
                longitude: 44.309862,
                latitude: 32.041684,
                status: 'WORKING',
                avatar: '/imgs/projects/project5-1.jpg',
                companyName: 'شركة اعمار',
                creatorId: 1,
                engineerName: 'سامر الجاعوني',
                engineerPhone: '0933445544',
                engineerDepartment: 'دائرة تنفيذ الانشاءات',
                payments: {
                    createMany: {
                        data: [
                            { amount: 1500000, description: 'دفعة اولى', creatorId: 1 },
                            { amount: 1500000, description: '', creatorId: 1 },
                            { amount: 2000000, description: 'دفعة المرحلة الاولى', creatorId: 1 }
                        ]
                    }
                },
                suspends: {
                    createMany: {
                        data: [
                            {
                                fromDate: new Date(2023, 2, 23),
                                toDate: new Date(2023, 5, 6),
                                description: 'صعوبة توفر المحروقات لنقل المواد',
                                documentUrl: '/docs/doc-s-6.docx',
                                creatorId: 1
                            }
                        ]
                    }
                }
            }
        });
        console.log(result);
    });
}
main().then(() => __awaiter(void 0, void 0, void 0, function* () { yield prisma.$disconnect(); }))
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(error);
    yield prisma.$disconnect();
}));
