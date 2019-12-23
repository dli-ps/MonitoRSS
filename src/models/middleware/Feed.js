/**
 * @this import('mongoose').DocumentQuery
 */
async function findOneAndUpdate () {
  const current = this.model.findOne(this.getQuery())
  if (current.guild !== this.guild) {
    throw new Error('Guild cannot be changed')
  }
}

/**
 * @this import('mongoose').MongooseDocument
 */
async function save () {
  const profile = await this.model('Guild').findById(this.guild).exec()
  const update = {
    $push: {
      feeds: this._id
    }
  }
  await profile.update(update).exec()
}

/**
 * @this import('mongoose').MongooseDocument
 */
async function remove () {
// There should only be 1 found, but use find just in case
  const profiles = await this.model('Guild').find({
    feeds: {
      $in: [this._id]
    }
  }).exec()

  const updates = profiles.map((profile) => {
    const update = {
      $pull: {
        feeds: this._id
      }
    }
    profile.update(update)
  })

  await Promise.all(updates)
}

module.exports = {
  findOneAndUpdate,
  save,
  remove
}
