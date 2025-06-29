import { ApolloServer } from '@apollo/server';
import { MongoClient } from 'mongodb';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
const { ObjectId } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

console.log('MONGODB_URI:', process.env.MONGODB_URI);


const typeDefs = `#graphql
  type TaskList{
    _id: ID!
    title: String!
    newList:Boolean!
    entries: [EntryItem!]!
  }

  type EntryItem{
    id: Int!
    date: String!
    title: String!
    content: String!
    edit: Boolean!
  }

  input EntryItemInput {
    date: String!
    title: String!
    content: String!
    edit:Boolean!
  }

  type Query {
    TaskLists: [TaskList!]!
    TaskList(TaskListID: ID!): TaskList!
  }

  type Mutation {
    createList(title:String!,newList:Boolean!): String
    deleteList(TaskListID: ID!):String
    updateList(TaskListID: ID!,title:String!):String
    createEntryItem(TaskListID: ID!,id: Int!,date:String!, title:String!, content: String!,edit:Boolean!): EntryItem
    updateEntryItem(TaskListID: ID!, id: Int!,date:String!, title:String!, content: String!,edit:Boolean!): EntryItem
    deleteEntryItem(TaskListID: ID!, id: Int!): String
    updateOrder(TaskListID: ID!,old_id:Int!,new_id:Int!): String
  }
`;

const resolvers = {
    Query: {
      
      TaskLists: async() =>{
        await client.connect();
        const db = client.db('EntryItemsDB'); 
        const collection = db.collection('TaskList');
        const tasklists = await collection.find().toArray();
        console.log(tasklists);
        return tasklists;
      },
      TaskList: async (_,{TaskListID}) => {
        await client.connect();
        const db = client.db('EntryItemsDB'); 
        const collection = db.collection('TaskList');
        console.log('Fetching items'); 
        console.log(TaskListID)

        const objectId = new ObjectId(String(TaskListID));
        // const tasklist = await collection.findOne({ _id: objectId });

        const tasklist = await collection.aggregate([
          { $match: { _id: objectId } },
          {
            $addFields: {
              entries: {
                $sortArray: {
                  input: "$entries",
                  sortBy: { id: 1 } 
                }
              }
            }
          }
        ]).next();
        // const tasklist = await collection.find({ _id: objectId }).sort({ 'entries.id': 1 }).toArray();;
        // if (tasklist.length === 0) {
        //   throw new Error("Document not found"); 
        // }
        // const document = tasklist[0];
        console.log('Task:', tasklist);
        return tasklist;
      },
    },
    Mutation: {
      createList: async(_,{title,newList})=>{
        await client.connect();
        const db = client.db('EntryItemsDB');
        const collection = db.collection('TaskList');

        const newTaskList = {
          title,
          newList,
          entries:[],
        };

        await collection.insertOne(newTaskList);

        return "Created new task list";
      },
      updateList: async(_,{TaskListID,title})=>{
        await client.connect();
        const db = client.db('EntryItemsDB');
        const collection = db.collection('TaskList');

        const newList = false;

        const newTaskList = {
          title,
          newList
        };
        const objectId = new ObjectId(String(TaskListID));

        const updateList = await collection.findOne({ _id: objectId });

        const newUpdate ={...updateList, ...newTaskList};

        await collection.updateOne(
          { _id: objectId },
          { $set:newUpdate}
        );

        return "Updated task list";
      },

      deleteList: async(_,{TaskListID})=>{
         await client.connect();
         const db = client.db("EntryItemsDB");
         const collection = db.collection('TaskList');

         const objectId = new ObjectId(String(TaskListID));

         await collection.deleteOne({
          _id: objectId
         });

         return "deleted task list";
      },
      createEntryItem: async (_, { TaskListID,id,date, title, content,edit}) => {
        await client.connect();
        const db = client.db('EntryItemsDB');
        const collection = db.collection('TaskList');
        
        id+=1
        const objectId = new ObjectId(String(TaskListID));
        
        await collection.updateOne(
          { _id: objectId, 'entries.id': { $gte: id } }, 
          { $inc: { 'entries.$[elem].id': 1 } }, 
          { arrayFilters: [{ 'elem.id': { $gte: id } }] }
        );

        const newEntry= { id, date, title, content,edit};

        await collection.updateOne(
          {_id: objectId},
          {$push: {entries:{$each: [newEntry],$position: id-1}}}
        );

        return newEntry;

      },
      updateEntryItem: async (_, {TaskListID, id, date,title,content,edit }) => {
        await client.connect();
        const objectId = new ObjectId(String(TaskListID));
        const db = client.db('EntryItemsDB');
        const collection = db.collection('TaskList');
        const UpdateObj = {id,date,title,content,edit}

        await collection.updateOne(
          {_id: objectId},
          {$set: {[`entries.${id-1}`]:UpdateObj}}
        );

        return UpdateObj;
      },
      deleteEntryItem: async (_, {TaskListID, id }) => {
        await client.connect();
        const db = client.db('EntryItemsDB');
        const collection = db.collection('TaskList');

        const objectId = new ObjectId(String(TaskListID));

        await collection.updateOne(
          {_id: objectId},
          {$pull: {entries:{id:id}}}
        );

        await collection.updateOne(
          { _id: objectId, 'entries.id': { $gt: id } }, 
          { $inc: { 'entries.$[elem].id': -1 } }, 
          { arrayFilters: [{ 'elem.id': { $gt: id } }] }
        );

        return `Entry item with id ${id} deleted`;
      },
      updateOrder: async (_,{TaskListID,old_id,new_id}) =>{
        await client.connect();
        const db = client.db('EntryItemsDB');
        const collection = db.collection('TaskList');

        const objectId = new ObjectId(String(TaskListID));
         

        const document = await collection.findOne({ _id: objectId });
        
        const e_index = document.entries.findIndex((entry) => entry.id === old_id);

        if (old_id !== new_id) {
        await collection.updateOne(
          { _id: objectId, 'entries.id': { $gt: old_id} }, 
          { $inc: { 'entries.$[elem].id': -1 } }, 
          { arrayFilters: [{ 'elem.id': { $gt: old_id} }] }
        );

        await collection.updateOne(
          { _id: objectId, 'entries.id': { $gt: new_id-1} }, 
          { $inc: { 'entries.$[elem].id': 1 } }, 
          { arrayFilters: [{ 'elem.id': { $gt: new_id-1} }] }
        );
        }
        await collection.updateOne(
          {_id: objectId},
          {$set: {[`entries.${e_index}.id`]:new_id}}
        );

        return `Order of item with id ${old_id} updated`;

      }
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  

  const handler = startServerAndCreateNextHandler(server);
  
  export async function GET(request) {
    return handler(request);
  }
  
  export async function POST(request) {
    return handler(request);
  }