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
     const head = headFromDatabase[0];
     res.json({
      nextWord: head.original,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      totalScore: req.language.total_score
     })
     next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try{
    const {answer} = req.body;
    const {language} =req;
    const headFromDatabase = await LanguageService.getWordById(req.app.get('db'), language.head);
    const head = headFromDatabase[0];
    const nextWordFromDatabase = await LanguageService.getWordById(req.app.get('db'), head.next);
    const nextWord = nextWordFromDatabase[0];
    const isCorrect = answer === 'correct' ? true : false;

    if(!isCorrect){
      head.next = nextWord.next;
      head.incorrect_count = head.incorrect_count + 1;
      head.memory_value = 1;
      nextWord.next = head.id;
      LanguageService.updateWordPointer(req.app.get('db'), nextWord)
      .then(()=> next())
     } 
    else {
      head.correct_count = head.correct_count + 1;
      head.memory_value = parseInt(head.memory_value) * 2;
      const traversetoMemoryValue= await getNthMemory(req.app.get('db'),  head, head.memory_value);
      head.next = traversetoMemoryValue.next;
      traversetoMemoryValue.next = head.id;
      LanguageService.updateWordPointer(req.app.get('db'), traversetoMemoryValue)
        .then(()=> next())
    }
    LanguageService.updateWordPointer(req.app.get('db'), head)
      .then(()=> next())
    language.head = nextWord.id;
    LanguageService.updateHead(req.app.get('db'), language)
      .then(() => next())
    

      
  
 const responseHeader = {
       nextWord: nextWord.original,
       totalScore: req.language.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      answer: head.translation,
      isCorrect
   }  
   
   res.json(responseHeader)// res.json('implement me!')
  }catch (error) {
    next(error)
  }
  })

  async function  getNthMemory (db, node, nth, result = 0){
    if(node.next === null| nth === result)
      return node;
    const head = await LanguageService.getWordById(db, node.next);
    const headObj = head[0];
   return getNthMemory(db, headObj, nth, result + 1);
  } 

module.exports = languageRouter
