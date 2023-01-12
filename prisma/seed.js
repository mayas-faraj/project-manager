import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main () {
  let result
  result = await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'administrator',
        password: '123',
        avatar: '/uploads/imgs/admin.png',
        role: 'ADMIN'
      },
      {
        id: 2,
        name: 'zaher',
        password: '123',
        avatar: '/uploads/imgs/zaher.png',
        role: 'PROJECT_MANAGER'
      },
      {
        id: 3,
        name: 'mayas',
        password: '123',
        avatar: '/uploads/imgs/mayas.png',
        role: 'VIEWER'
      }
    ]
  })

  console.log(result)

  result = await prisma.company.createMany({
    data: [
      {
        id: 1,
        name: 'شام القابضة',
        excerpt: 'شركة بناء وتعمير وتعهدات ضمن محافظة النجف',
        avatar: '/uploads/imgs/sham.png',
        creatorId: 1
      },
      {
        id: 2,
        name: 'اعمار للانشاءات',
        excerpt: 'شركة هندسية للإنشاء والتعمير والدراسات',
        avatar: '/uploads/imgs/emar.png',
        creatorId: 2
      },
      {
        id: 3,
        name: 'ارامكو',
        excerpt: 'تعهدات بناء ضمن العراق',
        avatar: '/uploads/imgs/aramco.png',
        creatorId: 2
      }
    ]
  })

  console.log(result)

  result = await prisma.department.createMany({
    data: [
      {
        id: 1,
        name: 'ادارة تنفيذ الانشاءات',
        excerpt: 'مؤسسة تابعة لوزارة الاعمار',
        avatar: '/uploads/imgs/mtaa.png',
        creatorId: 1
      },
      {
        id: 2,
        name: 'دائرة الاعمار',
        excerpt: 'دائرة حكومية خاصة باعادة الاعمار',
        avatar: '/uploads/imgs/emar-dep.png',
        creatorId: 2
      },
      {
        id: 3,
        name: 'دائرة الرقابة والتفتيش',
        excerpt: 'دائرة تابعة لهيئة الرقابة والتفتيش',
        avatar: '/uploads/imgs/investigate.png',
        creatorId: 2
      }
    ]
  })

  console.log(result)

  result = await prisma.engineer.createMany({
    data: [
      {
        id: 1,
        name: 'لؤي صوان',
        phone: '0911223344',
        excerpt: 'مهندس انشائي بخبرة 15 سنة',
        avatar: '/uploads/imgs/loai.png',
        creatorId: 1,
        departmentId: 1
      },
      {
        id: 2,
        name: 'عادل العلي',
        phone: '0933445566',
        excerpt: 'مهندس مدني مختص بالدراسات الهندسية',
        avatar: '/uploads/imgs/adel.png',
        creatorId: 1,
        departmentId: 1
      },
      {
        id: 3,
        name: 'سامر القطشة',
        phone: '0922334455',
        excerpt: 'مهندس عمارة خبرة 18 سنة',
        avatar: '/uploads/imgs/samer.png',
        creatorId: 1,
        departmentId: 1
      },
      {
        id: 4,
        name: 'عماد الاحمد',
        phone: '0912312312',
        excerpt: 'مهندس عمارة خريج 2012',
        avatar: '/uploads/imgs/emad.png',
        creatorId: 1,
        departmentId: 1
      }
    ]
  })

  console.log(result)

  result = await prisma.project.create({
    data: {
      name: 'نقابة المهندسين',
      excerpt: 'مشروع اعادة نقابة المهنسين العراقيين',
      remark: 'لا يوجد',
      address: 'الانبار - الشارع العام',
      locationLatitude: 16.5,
      locationLongitude: 22.5,
      duration: 450,
      cost: 1600000000,
      amountPaid: 400000000,
      status: 'WORKING',
      engineerId: 1,
      companyId: 1,
      creatorId: 1,
      media: {
        createMany: {
          data: [
            { src: '/uploads/imgs/project1-1.png', title: 'واجهة البناء', creatorId: 1 },
            { src: '/uploads/imgs/project1-2.png', title: 'منظر جانبي', creatorId: 1 },
            { src: '/uploads/imgs/project1-3.png', title: 'منظر جانبي', creatorId: 1 }
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
              description: 'نقص مواد',
              creatorId: 1
            },
            {
              fromDate: new Date(2023, 4, 25),
              toDate: new Date(2023, 6, 1),
              description: 'ظروف جوية سيئة',
              creatorId: 1
            }
          ]
        }
      }
    }
  })

  console.log(result)

  result = await prisma.project.create({
    data: {
      name: 'ملعب الاتحاد',
      excerpt: 'ملعب كرة قدم',
      remark: 'لا يوجد',
      address: 'الانبار - بناء المحافظة',
      locationLatitude: 12.5,
      locationLongitude: 52.5,
      duration: 450,
      cost: 1100000000,
      amountPaid: 340000000,
      status: 'WORKING',
      engineerId: 2,
      companyId: 2,
      creatorId: 2,
      media: {
        createMany: {
          data: [
            { src: '/uploads/imgs/project2-1.png', title: 'منظر علوي', creatorId: 2 },
            { src: '/uploads/imgs/project2-2.png', title: 'منظر جانبي', creatorId: 2 }
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
              description: 'تسريح عدد كبير من موظفي الشركة',
              creatorId: 1
            }
          ]
        }
      }
    }
  })

  console.log(result)

  result = await prisma.project.create({
    data: {
      name: 'ساحة الحياة',
      excerpt: 'ساحة وسط المحافظة مزودة بنوافير لضخ المياة وحديقة ازهار',
      remark: 'لا يوجد',
      address: 'ساحة المدينة - الشارع الرئيسي',
      locationLatitude: 16.5,
      locationLongitude: 22.5,
      duration: 250,
      cost: 200000000,
      amountPaid: 100000000,
      status: 'LATE',
      engineerId: 4,
      companyId: 3,
      creatorId: 1,
      media: {
        createMany: {
          data: [
            { src: '/uploads/imgs/project3-1.png', title: 'المنظر العلوي', creatorId: 1 },
            { src: '/uploads/imgs/project3-2.png', title: 'من ساحة الحياة', creatorId: 1 },
            { src: '/uploads/imgs/project3-3.png', title: 'من الشارع العام', creatorId: 1 }
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
              creatorId: 1
            },
            {
              fromDate: new Date(2023, 3, 15),
              toDate: new Date(2023, 4, 1),
              description: 'تغير سعر الصرف',
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
  })

  console.log(result)

  result = await prisma.project.create({
    data: {
      name: 'مشفى الامل',
      excerpt: 'مشفى عامل لعلاج جميع الامراض',
      remark: 'بدء البناء بجوائز ارتفاع 3 امتار',
      address: 'ساحة المدينة - الشارع الرئيسي',
      locationLatitude: 16.5,
      locationLongitude: 22.5,
      duration: 180,
      cost: 1200000000,
      amountPaid: 400000000,
      status: 'WORKING',
      engineerId: 3,
      companyId: 3,
      creatorId: 2,
      media: {
        createMany: {
          data: [
            { src: '/uploads/imgs/project4-1.png', title: 'منظر رئيسي', creatorId: 2 },
            { src: '/uploads/imgs/project4-2.png', title: '', creatorId: 2 },
            { src: '/uploads/imgs/project4-3.png', title: '', creatorId: 2 }
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
  })

  console.log(result)

  result = await prisma.project.create({
    data: {
      name: 'مدرسة التفوق للمتميزين',
      excerpt: 'مدرسة نموذجية للمتفوقين في الشهادة الاعدادية بكافة فروعها',
      remark: 'تم انشائها على نمط بناء اوروبي حديث',
      address: 'شارع النصر - مقابل دار المهندسين',
      locationLatitude: 16.5,
      locationLongitude: 22.5,
      duration: 400,
      cost: 1350000000,
      amountPaid: 350000000,
      status: 'WORKING',
      engineerId: 3,
      companyId: 2,
      creatorId: 1,
      media: {
        createMany: {
          data: [
            { src: '/uploads/imgs/project4-1.png', title: 'مخطط المشروع', creatorId: 1 }
          ]
        }
      },
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
              creatorId: 1
            }
          ]
        }
      }
    }
  })

  console.log(result)
}

main().then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error)
    prisma.$disconnect()
  })
