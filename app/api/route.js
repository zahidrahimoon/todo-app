import ConnectDB from "@/lib/config/db";
import TodoModel from "@/lib/models/TodoModel";
import { NextResponse } from "next/server";

// Handling GET request
export async function GET(request) {
  await ConnectDB();
  const todos = await TodoModel.find({});
  return NextResponse.json({ todos });
}

// Handling POST request
export async function POST(request) {
  await ConnectDB();
  const { title, description } = await request.json();
  if (!title || !description) {
    return NextResponse.json({ msg: "Please provide all required fields." }, { status: 400 });
  }
  try {
    const newTodo = await TodoModel.create({ title, description });
    return NextResponse.json({ msg: "Todo added successfully!" });
  } catch (error) {
    return NextResponse.json({ msg: "Failed to add todo." }, { status: 500 });
  }
}

// Handling DELETE request
export async function DELETE(request) {
  await ConnectDB();
  const id = request.nextUrl.searchParams.get('id'); // Correct way to get query params
  if (!id) {
    return NextResponse.json({ msg: "No ID provided." }, { status: 400 });
  }
  try {
    await TodoModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Todo deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ msg: "Failed to delete todo." }, { status: 500 });
  }
}

// Handling PUT request for completing todo
// Handling PUT request for completing todo
export async function PUT(request) {
  await ConnectDB();
  const id = request.nextUrl.searchParams.get('id'); // Get ID from query params
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
    return NextResponse.json({ msg: "Todo marked as completed!", todo: updatedTodo });
  } catch (error) {
    return NextResponse.json({ msg: "Failed to complete todo." }, { status: 500 });
  }
}




export default async function handler(req, res) {
  await ConnectDB();

  const { method } = req;
  const { id } = req.query; // Get the ID from the query parameters

  switch (method) {
    case 'PUT':
      try {
        const { title, description } = req.body;

        // Validate ID presence
        if (!id) {
          return res.status(400).json({ message: 'ID is required' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
          id,
          { title, description },
          { new: true, runValidators: true }
        );

        if (!updatedTodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ todo: updatedTodo });
      } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Server error' });
      }
      break;

    // Handle other methods (GET, POST, DELETE) if needed

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

