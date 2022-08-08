<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Blade::directive('stars', function ($stars) {

            return "<?php
                    ". '$remainder' ." = floatval($stars) - floor(floatval($stars));

                    echo '<span class=\"rating\" title=\"' . $stars . ' ' . trans_choice('common.star',  $stars) . '\">';

                    for (". '$i' ." = 1; ". '$i' ." <= floor($stars); ". '$i' ."++) {
                        echo '<svg class=\"icon star\">
                                        <use xmlns:xlink=\"http://www.w3.org/2000/svg\" xlink:href=\"/img/icons/icon-defs.svg#icon-star\"></use>
                                      </svg>';
                    }

                    if (". '$remainder' ."  === 0.5) {
                        echo '
                            <div class=\"icon icon-stack\">
                                <svg class=\"icon star\">
                                    <use xmlns:xlink=\"http://www.w3.org/2000/svg\" xlink:href=\"/img/icons/icon-defs.svg#icon-star\"></use>
                                </svg>
                                <svg class=\"icon star-half\">
                                    <use xmlns:xlink=\"http://www.w3.org/2000/svg\" xlink:href=\"/img/icons/icon-defs.svg#icon-star-half\"></use>
                                </svg>
                            </div>';
                    }

                    ". '$empty' ." = (int)floor(5 - $stars);
                    if (".'$empty'." > 0) {
                         while (".'$empty'."-- != 0) {
                            echo '<svg class=\"icon star-empty\">
                                        <use xmlns:xlink=\"http://www.w3.org/2000/svg\" xlink:href=\"/img/icons/icon-defs.svg#icon-star\"></use>
                                      </svg>';
                        }
                    }

                    echo '</span>';
             ?>";
        });
    }
}
