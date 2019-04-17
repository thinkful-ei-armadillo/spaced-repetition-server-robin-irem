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
    .select('correct_count', 'incorrect_count', 'next','translation','original','id','memory_value')
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
    .where({id: updatedLang.id})
    .update(updatedLang).returning('*');
  },
  // getNthMemory(db, value, nth, result = 0){
  //   if(nth === result){
  //     return value;
  //    }
  //    result + 1;
  //    console.log(value)
  //  const head = this.getWordById(db, value.next);
  //  const headObj = head[0]
  //  return this.getNthMemory(db, headObj, nth, result);
  // } 
}

module.exports = LanguageService
