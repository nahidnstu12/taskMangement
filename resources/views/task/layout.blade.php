<div class="container">
    <div class="row text-center">
        @foreach ($tasks as $task)
        @php
        $imageUrl = $task->image ?? "dummy.png";
        @endphp
        <!-- Team item -->
        {{-- col-xl-3 col-sm-6 --}}
        <div class="col-12 mb-5 card-view" style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); ">
            {{-- d-flex justify-content-between --}}
            <div class="bg-white rounded shadow-sm py-5 px-4 d-flex justify-content-between" id="img-div">
                <img src="storage/images/{{ $imageUrl }}" alt="" width="100"
                    class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm">
                {{-- mx-auto --}}
                <div class="text-center">
                    <h5 class="mb-0">{{ $task->tasktitle }}</h5>
                    <span class="small text-uppercase text-muted">ID: {{ $task->user->name }}</span>
                </div>
            </div>
            @php
            $adminAction = Auth::user()->id !== $task->user->id;
            // dd($currentUser);

            @endphp
            {{-- --}}

            <div class="d-flex justify-between">
                <p class="mt-3" style="text-align: justify; max-width:85%;">{{ $task->description }}</p>
                <div class="d-flex align-items-center px-2">
                    <a href="#" id="{{ $task->id }}" class="text-success mx-1 editIcon {{ $adminAction ? " disabled": ""
                        }}" onmouseover="{{ $adminAction }} && alert('you haven\'t permission')" data-toggle="modal"
                        data-target="#editTaskModal"><i class="fas fa-marker"></i></a>

                    <a href="#" id="{{ $task->id }}" class="text-danger mx-1 deleteIcon {{ $adminAction ? "
                        disabled": "" }}" onmouseover="{{ $adminAction }} && alert('you haven\'t permission')">
                        <i class="fas fa-trash"></i></a>
                </div>
            </div>

        </div>
        

        @endforeach
    </div>
</div>
<div class="pagination justify-end space-x-3">
    {!! $tasks->links() !!}
</div>