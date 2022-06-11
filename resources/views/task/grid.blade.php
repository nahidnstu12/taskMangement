@foreach ($tasks as $task)
@php
$imageUrl = $task->image ?? "dummy.png";
@endphp
<div class="card" style="width: 18rem;">
    <img src="storage/images/{{ $imageUrl }}" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">{{ $task->title }}</h5>
        <p class="card-text">{{ $task->description }}</p>
        
    </div>
</div>
@endforeach