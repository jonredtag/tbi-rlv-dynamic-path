<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, minimum-scale=1">
        <title>Session Expired</title>
        <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body class="modal-open">
        <div id="app" data-page="error">
            @include('modules.header')
            <div tabindex="-1" style="position: relative; z-index: 1050; display: block;">
                <div>
                    <div class="modal fade show" role="dialog" tabindex="-1" style="display: block;">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header modal-solid-header-bar">
                                    <h5 class="modal-title h4">Session Expired<a href="/" class="close close-lg pt-3" aria-label="Close">
                                        <span class="pt-md-1 d-inline-block" aria-hidden="true">×</span></a>
                                        </h5>
                                    </div>
                                    <div class="modal-body">
                                        <div><p>Click reload below to resume your search.</p>
                                        <a href="/" class="btn btn-lg btn-secondary">Reload Search</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-backdrop fade show"></div>
                </div>
            </div>
            @include('modules.footer')
        </div>
    </body>
</html>