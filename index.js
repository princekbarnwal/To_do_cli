#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "todos.json");

// Load todos
function loadTodos() {
  if (!fs.existsSync(FILE_PATH)) return [];
  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// Save todos
function saveTodos(todos) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
}

// Commands
const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case "add":
    addTodo(args.join(" "));
    break;
  case "list":
    listTodos();
    break;
  case "done":
    markDone(parseInt(args[0]));
    break;
  case "delete":
    deleteTodo(parseInt(args[0]));
    break;
  default:
    console.log(`
Usage:
  node todo.js add "Task description"
  node todo.js list
  node todo.js done <id>
  node todo.js delete <id>
`);
}

function addTodo(task) {
  if (!task.trim()) return console.log("⚠️  Cannot add empty task.");
  const todos = loadTodos();
  const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
  todos.push({ id, task, done: false });
  saveTodos(todos);
  console.log(`✅ Added: "${task}"`);
}

function listTodos() {
  const todos = loadTodos();
  if (!todos.length) return console.log("No todos yet.");
  todos.forEach(t => {
    console.log(`${t.id}. ${t.done ? "✔️" : "❌"} ${t.task}`);
  });
}

function markDone(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) return console.log(`⚠️  Task ${id} not found.`);
  todo.done = true;
  saveTodos(todos);
  console.log(`✅ Task ${id} marked as done.`);
}

function deleteTodo(id) {
  let todos = loadTodos();
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === before) return console.log(`⚠️  Task ${id} not found.`);
  saveTodos(todos);
  console.log(`🗑️  Deleted task ${id}.`);
}
