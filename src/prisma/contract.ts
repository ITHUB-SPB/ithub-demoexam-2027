import { defineContract } from '@prisma/orm-postgres/contract-builder';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = model('User', {
    fields: {
      id: field.id.uuidv7String(),
      email: field.text().unique(),
      username: field.text(),
      password: field.text(),
      name: field.text(),
      phone: field.text(),
    },
  });

  const Course = model('Course', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text().unique()
    }
  })

  const PaymentType = model('PaymentType', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text().unique()
    }
  })

  const Entry = model('Entry', {
    fields: {
      id: field.id.uuidv7String(),
      authorId: field.uuidString(),
      courseId: field.uuidString(),
      paymentTypeId: field.uuidString(),
      startDate: field.dateTime(),
    },
  });

  return {
    models: {
      User: User.relations({
        entries: rel.hasMany(Entry, { by: 'authorId' }),
      }),
      Entry: Entry.relations({
        author: rel.belongsTo(User, { from: 'authorId', to: 'id' }),
        course: rel.belongsTo(Course, { from: 'courseId', to: 'id' }),
        paymentType: rel.belongsTo(PaymentType, { from: 'paymentTypeId', to: 'id' }),
      }),
      // Course: Course.relations({
      //   entries: rel.hasMany(Entry, { by: 'courseId' }),
      // }),
    },
  };
});
