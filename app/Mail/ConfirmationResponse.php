<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ConfirmationResponse extends Mailable
{
    public $data;
    public $type;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data, $type = 'customer')
    {
        $this->data['emailData'] = $data;
        $this->data['email'] = true;
        $this->data['email_url'] = config('app.url');
        $this->type = $type;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "Hi, your Order " . $this->data['emailData']['bookingNumber'] . " has been Confirmed.";

        if ($this->type === 'internal') {
            if (config('accertify.enabled')) {
                $accDetails = $this->data['emailData']['accertifyDetails'] ?? [];
                if (!empty($accDetails) && (isset($accDetails['postCall']) || isset($accDetails['preCall']))) {

                    if (isset($accDetails['preCall']['score'])) {
                        // if ($config['accertify']['scoreRange']['medium']['min'] <= $accDetails['preCall']['score'] && $config['accertify']['scoreRange']['medium']['max'] >= $accDetails['preCall']['score']) {
                        if (true) {
                            $subject .= ' - Accertify (' . $accDetails['preCall']['status'] . ' - ' . $accDetails['preCall']['score'] . ')';
                        }
                    } elseif (isset($accDetails['postCall']['score'])) {
                        // if ($config['accertify']['scoreRange']['medium']['min'] <= $accDetails['postCall']['score'] && $config['accertify']['scoreRange']['medium']['max'] >= $accDetails['postCall']['score']) {
                        if (true) {
                            $subject .= ' - Accertify (' . $accDetails['postCall']['status'] . ' - ' . $accDetails['postCall']['score'] . ')';
                        }
                    }
                }
            }
        }
        return $this->view('emails.confirmation')
            ->subject($subject)
            ->with($this->data);
    }
}
