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

  const Entry = model('Entry', {
    fields: {
      id: field.id.uuidv7String(),
      authorId: field.uuidString(),
      courseId: field.uuidString(),
      startDate: field.dateTime(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });

  return {
    models: {
      User: User.relations({
        posts: rel.hasMany(Post, { by: 'authorId' }),
      }),
      Post: Post.relations({
        author: rel.belongsTo(User, { from: 'authorId', to: 'id' }),
      }),
    },
  };
});
