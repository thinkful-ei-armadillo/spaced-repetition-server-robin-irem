const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try{
    const headId = req.language.head;
    const headFromDatabase = await LanguageService.getWordById(req.app.get('db'), headId);
    // const head = Object
     res.json({
      nextWord: head[0].original,
      wordCorrectCount: head[0].correct_count,
      wordIncorrectCount: head[0].incorrect_count,
      totalScore: req.language.total_score
     })
     next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const {answer} = req.body;
    const {language} =req;
    const headFromDatabase = await LanguageService.getWordById(req.app.get('db'), language.head);
    const head = headFromDatabase[0];
    const nextWordFromDatabase = await LanguageService.getWordById(req.app.get('db'), head.next);
    const nextWord = nextWordFromDatabase[0];
  
 
    if(answer === 'incorrect'){
      head.next = head.next + 2;//moves up two 
      head.incorrect_count = head.incorrect_count + 1;
      nextWord.next = head.id; //points to current
      language.head = nextWord.id;
      console.log(language);
      console.log(nextWord)
      console.log(head)
      LanguageService.updateWordPointer(req.app.get('db'), head)
      LanguageService.updateWordPointer(req.app.get('db'), nextWord)
      LanguageService.updateHead(req.app.get('db'), language)
     } //set user head to next
      // LanguageService.wrongAnswer(req.app.get('db'))
    else if(answer === 'correct')
    //   if()
    //   head.next =null => appendtoEnd
    //  // set.user head to next

     //at end return user info

      // nextWord: testLanguagesWords[1].original,
      // totalScore: 0,
      // wordCorrectCount: 0,
      // wordIncorrectCount: 0,
      // answer: testLanguagesWords[0].translation,
      // isCorrect: false
    res.json('implement me!')
  })

module.exports = languageRouter
