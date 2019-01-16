const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds} })
  .then(events => {
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Data(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  })
  .catch(err => {
    throw err;
  });
};

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator )
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5c3cb6dc184a8517fcb80836'
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = {
          ...result._doc,
          _id: result.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc._creator)};
        return User.findById('5c3cb6dc184a8517fcb80836');
      })
      .then(user => {
        if (!user) {
          throw new Error('User niema takiego');
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(result => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: args => {
    return User.findOne({email: args.userInput.email})
      .then(user => {
        if (user) {
          throw new Error('User już jest!')
        }
        return bcrypt.hash(args.userInput.password, 12)
      })
      .then(hashedPassword => {
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
      return { ...result._doc, password: null, _id: result.id };
    })
    .catch(err => {
      throw err;
    });
  }
};
