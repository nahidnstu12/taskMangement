<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Response;

class TaskController extends Controller
{
	public function index()
	{
		$isAdmin = Auth::user()->role === "1";
		// dd($isAdmin);
		$tasks = Auth::user()
			->tasks()
			->orderByDesc('created_at')
			->paginate(2);
		// return view("task.index")->with("tasks",$tasks);
		return view("task.index", compact("tasks", "isAdmin"));
	}
// use it fetch data
	public function showAll(Request $request)
	{
	
		// dd($request->all());
		$userid = Auth::user()->id;
		// $username = Auth::user()->name;
		
		if($request->check == 'true'){
			
			// admin view
			$tasks = Task::paginate(2);
			// $username = $tasks->user->name;
			// return response()->json(['tasks' => $tasks, "msg"=>"all data"]);
		}else{
			//user specific tasks
			$tasks = Auth::user()
			->tasks()
			->orderByDesc('created_at')
			->paginate(2);
			// return response()->json(['tasks' => $tasks, "msg"=>"userdata"]);
		}

		if ($request->ajax()) {
			 return Response::json(['tasks' => $tasks, "userid"=>$userid], 200);
		}
		return Response::json('Tasks not found!', 400);
	}
	// user created lists view
	// public function fetchAll(Request $request)
	// {
	// 	$tasks = Auth::user()
	// 		->tasks()
	// 		->orderByDesc('created_at')
	// 		->paginate(2);
	// 	if ($request->ajax()) {
	// 		return view("task.layout", compact("tasks"))->render();
	// 	}
	// 	return view("task.index", compact("tasks"));
	// }

	// handle insert a new taskloyee ajax request
	public function store(Request $request)
	{
		$file = $request->file('image');
		$fileName = null;
		if ($request->hasFile("image")) {
			$fileName = time() . '.' . $file->getClientOriginalExtension();
			$file->storeAs('public/images', $fileName);
		}

		$data = $this->validate($request, [
			'tasktitle' => 'required|string|max:255',
			'description' => 'required|string|max:255',
		]);

		Auth::user()->tasks()->create([
			'tasktitle' => $data['tasktitle'],
			'description' => $data["description"],
			'image' => $fileName
		]);

		return response()->json([
			'status' => 200,
		]);
	}

	// handle edit an taskloyee ajax request
	public function edit(Task $task, Request $request)
	{
		// dd($task->id);
		// $this->authorize('editView', $task);
		$id = $request->id;
		$task = Task::find($id);
		return response()->json($task);
	}

	// handle update an taskloyee ajax request
	public function update(Task $task, Request $request)
	{
		// $this->authorize('complete', $task);
		$fileName = '';
		$task = Task::find($request->task_id);
		if ($request->hasFile('image')) {
			$file = $request->file('image');
			$fileName = time() . '.' . $file->getClientOriginalExtension();
			$file->storeAs('public/images', $fileName);
			if ($task->image) {
				Storage::delete('public/images/' . $task->image);
			}
		} else {
			$fileName = $request->task_image;
		}

		$taskData = ['tasktitle' => $request->tasktitle, 'description' => $request->description, 'image' => $fileName];

		$task->update($taskData);
		return response()->json([
			'status' => 200,
		]);
	}

	// handle delete an taskloyee ajax request
	public function delete(Task $task, Request $request)
	{
		// dd($task->id);
		$this->authorize('deleteTask', $task);
		$id = $request->id;

		$task = Task::find($id);
		// return response()->json($task);
		if ($task->count() > 0) {
			Storage::delete('public/images/' . $task->image);
			Task::destroy($id);
		}
	}
}