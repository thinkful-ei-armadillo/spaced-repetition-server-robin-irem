class _Node{
  constructor(value){
    this.value = value;
    this.next = null;
  }
}
class LanguageLinkedList{
  constructor(){
    this.head = null;
    this.tail = this.head;
    this.length = 0;
  }
  append(value){
    const newNode = new _Node(value);  
    if(this.head === null){
      this.head = newNode;
      this.tail = newNode;
      this.length++; 
    }
    this.tail.next = newNode;
    this.tail = newNode;
    this.length++;
    return this;
  }
}

function createLinkedListFromSQL(list){
  const LinkedList = new LinkedList();
  list.forEach()
}