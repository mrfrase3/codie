const fsSync = require('fs');
const fs = fsSync.promises;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const namor = require('namor');
const _ = require('lodash');
const app = require('../../app');

const file = './storage/users.json';
const saltRounds = 10;
let users;
try {
  users = JSON.parse(fsSync.readFileSync(file));
} catch (err) {
  users = [];
}
const save = () => fs.writeFile(file, JSON.stringify(users, null, 2));

const safe = (user) => _.omit(user, ['password']);

module.exports = {
  get(id) {
    const user = users.find((u) => u.id === id);
    return user ? safe(user) : null;
  },

  all() {
    return users.map(safe);
  },

  async create(username, password, isAdmin) {
    if (users.some((u) => u.username === username)) {
      throw new app.errors.UserExists();
    }

    let slug = `codie-${namor.generate({ words: 3, saltLength: 0 })}`;
    // eslint-disable-next-line no-loop-func
    while (users.some((u) => u.slug === slug)) {
      slug = `codie-${namor.generate({ words: 3, saltLength: 0 })}`;
    }

    const user = {
      id: uuidv4(),
      slug,
      username,
      password: await bcrypt.hash(password || uuidv4(), saltRounds),
      passwordLastUpdated: Date.now(),
      admin: isAdmin,
    };
    users.push(user);
    await save();
    return safe(user);
  },

  async patch(id, data) {
    const user = users.find((u) => u.id === id);
    Object.keys(safe(data)).forEach((i) => {
      _.set(user, i, _.get(data, i));
    });
    if (data.password) {
      user.password = await bcrypt.hash(data.password || uuidv4(), saltRounds);
      user.passwordLastUpdated = Date.now;
    }
    await save();
    return safe(user);
  },

  async remove(id) {
    users = users.filter((u) => u.id !== id);
    await save();
  },

  async login(username, password) {
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new app.errors.InvalidLogin();
    }
    return safe(user);
  },

  async changePassword(id, oldPass, newPass) {
    const user = users.find((u) => u.id === id);
    await this.login(user.username, oldPass);
    user.password = await bcrypt.hash(newPass || uuidv4(), saltRounds);
    user.passwordLastUpdated = Date.now;
    await save();
    return safe(user);
  },

  init() {
    if (users.length) return Promise.resolve();
    return this.create(
      process.env.INIT_USERNAME || 'admin',
      process.env.INIT_PASSWORD || 'admin',
      true,
    );
  },
};
