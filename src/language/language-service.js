const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.tail',
        'language.totalWords',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getWordById(db, id){
    return db
    .from('word')
    .select('*')
    // .select('correct_count', 'incorrect_count', 'next','translation','original','id')
    .where({id})
  },
  updateWordPointer(db, updatedPointer){
    console.log('lol')
    return db.into('word')
    .where({id: updatedPointer.id})
    .update(updatedPointer);
  },
  updateHead(db, updatedLang){
    console.log('hi')
    return db.into('language')
    .where({user_id: updatedLang.id})
    .update(updatedLang);
  }
}

module.exports = LanguageService
