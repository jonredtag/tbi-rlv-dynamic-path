@extends('template')

@section('content')
<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card card-default box-shadow border-0">
                <div class="card-body">


                    @if(session('error'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            {!! session('error') !!}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    @endif

                    <h4 class="mb-4 font-weight-bold">Verify this device:</h4>
                    <p class="h6 mb-0">A code has been sent to your <b>SMS Account</b>.</p>
                    <p class="h6 mb-4">This code expires in 30 mins.</p>
                    <form class="custom-form-element" action="{{route('smsCheckToken', ['code' => $code])}}" method="post">
                        @csrf
                        <div class="form-group">
                            <label for="token" class="">Enter Code:</label>
                            <div class="">
                                <input id="token" type="text"
                                    class="form-control @error('token') is-invalid @enderror"
                                    name="token" value="{{ old('token') }}" required>
                                @error('token')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group my-4">
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary h5 col-12 py-2">
                                    {{ __('Verify') }}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div class="text-center">
                        <button type="button" id="sms_resend" data-code="{{ $code }}" class="btn btn-link mt-4 h6 font-weight-bold">Send Code Again</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@stop
