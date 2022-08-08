<?php

namespace App\Repositories\Concrete;

use App\Repositories\Contracts\MyAccountInterface;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserToken;
use App\Models\Travelers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\SystemCity;
use App\Models\UserBookings;

class MyAccountRepository implements MyAccountInterface {


    function __construct() {
        
    }

    public function myprofile($params) {

        $meta=array("title"=>"My Profile",
        "description"=>"My Profile",
        "keywords"=>"My Profile"
        );
        return view('pages.my-account',['meta'=> $meta,'active'=>true ,'bannerData'=>'' ]);

    
    }
    
    public function updatePassword($params) {

        $inputData = json_decode($params['data'], true);

       // $inputData =  json_decode($request->input('data'), true);

        $validator = Validator::make($inputData, [
         
            'CurrentPassword' => [
                'required',
                'string',
                'min:6',             // must be at least 10 characters in length
                'max:20',              // must be max 20 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ],
            'NewPassword' => [
                'required',
                'string',
                'min:6',             // must be at least 10 characters in length
                'max:20',              // must be max 20 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ],
            'ConfirmPassword' => [
                'required',
                'string',
                'min:6',             // must be at least 10 characters in length
                'max:20',              // must be max 20 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ]
         ]);

         $returnData = [];

         if($validator->fails()) {

            $returnData['status'] = false;
            $returnData['message'] = $validator->errors()->first();
            return $returnData;

        } else{

            $user_token = request()->cookie('authid');
            $user_id = UserToken::select('user_id')->where('token', $user_token)->first();

            if(isset($user_id) && !empty($user_id)) {
                $current_password = User::where('id', $user_id->user_id)->where('userActivated',1)->where('site_id','=',config('site.profile_key'))->first();
                
                if(Hash::check($inputData['CurrentPassword'], $current_password->password)) {
                    if($inputData['NewPassword'] != $inputData['ConfirmPassword']) {
                        $returnData['status'] = false;
                        $returnData['message'] = "Password Does Not Match!";
                        return $returnData;
                    } else {

                        $update_password = User::where('id', $user_id->user_id)->where('userActivated',1)->where('site_id','=',config('site.profile_key'))->update(['password' => Hash::make( $inputData['ConfirmPassword'])]);
                        
                        if($update_password) {
                            $returnData['status'] = true;
                            $returnData['data'] = $update_password;
                            return $returnData;
                        } else {
                            $returnData['status'] = false;
                            $returnData['message'] = "Oops! Something went wrong, Please try again";
                            return $returnData;
                        }
                    }
                } else {
                    $returnData['status'] = false;
                    $returnData['message'] = "Invalid Password!";
                    return $returnData;
                }
            } else {
                return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
            }
        }    
    }

    public function updatePersonalInfo($params) {
        // dd($params);
        $inputData = json_decode($params['data'], true);
        
        $validator = Validator::make($inputData, [
            'Title' => ['required'],
            'FirstName' => ['required', 'string', 'max:255'],
            'LastName' => ['required', 'string', 'max:255'],
            'Gender' => ['required', 'string', 'max:255'],
            'ConvertedDateOfBirth' => ['required'],
            'PhoneExt' => ['required', 'string', 'max:255'],
            'Phone' => ['required', 'string', 'max:255'],
            'AltPhoneExt' => ['required', 'string', 'max:255'],

         ]);

         $returnData = [];

         if($validator->fails()) {

            $returnData['status'] = false;
            $returnData['message'] = $validator->errors()->first();
            return $returnData;

        } else{

            $user_token = request()->cookie('authid');
            $user_id = UserToken::select('user_id')->where('token', $user_token)->first();
            
            if(isset($user_id) && !empty($user_id)) {

                $user_data = User::where('id', $user_id->user_id)->where('userActivated',1)->update([
                    'title' => $inputData['Title'],
                    'firstname' => $inputData['FirstName'],
                    'lastname' => $inputData['LastName'], 
                    'gender' =>  $inputData['Gender'],
                    'dob' =>  $inputData['ConvertedDateOfBirth'],
                    'phoneExt' =>  $inputData['PhoneExt'],
                    'phoneNumber' =>  $inputData['Phone'],
                    'altPhoneExt' =>  isset($inputData['AltPhone']) && !empty($inputData['AltPhone']) ? $inputData['AltPhoneExt'] : '',
                    'altPhoneNumber' =>  $inputData['AltPhone'],
                    'emergencyFirstName' =>  $inputData['EmergencyContactFirstName'],
                    'emergencyLastName' =>  $inputData['EmergencyContactLastName'],
                    'emergencyPhoneExt' =>  isset($inputData['EmergencyContactPhone']) && !empty($inputData['EmergencyContactPhone']) ? $inputData['EmergencyContactPhoneExt'] : '',
                    'emergencyPhoneNumber' =>  $inputData['EmergencyContactPhone'],
                    ]);

                    if($user_data) {
                        $returnData['status'] = true;
                        $returnData['data'] = $user_data;
                        return $returnData;
                    } else {
                        $returnData['status'] = false;
                        $returnData['message'] = 'Oops! Something went wrong, Please try again';
                        return $returnData;
                    }
            } else {
                return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
            }
            }
    }

    public function updateEmailPreferences($params){

        $inputData = json_decode($params['data'], true);

        $user_token = request()->cookie('authid');
        $user_id = UserToken::select('user_id')->where('token', $user_token)->first();
      
        $returnData = [];

        if(isset($user_id) && !empty($user_id)) {
            $email_preferences =  User::where('id', $user_id->user_id)->where('userActivated',1)->where('site_id','=',config('site.profile_key'))
                                ->update( ['seatingPreference' => $inputData['Seating'] == true ? 1 : 0,
                                'redtagRewardsPreference' => $inputData['Reward'] == true ? 1 : 0, 
                                'travelReviewsPreference' =>  $inputData['Review'] == true ? 1 : 0,
                                'surveyPreference' => $inputData['Surveys'] == true ? 1 : 0,
                                'subscribePreference' =>  $inputData['UnSubscribe']== true ? 1 : 0,
                                    ]);
        
            if($email_preferences){
            
                $returnData['status'] = true;
                $returnData['data'] = $email_preferences;
                return $returnData;
            } else{
                $returnData['status'] = false;
                $returnData['message'] = "Oops! Something went wrong, Please try again";
                return $returnData;
            }
            
        } else {

            return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
            }
    }
    
    public function getPersonalInfo(){
       
            $user_token = request()->cookie('authid');
            $user_id = UserToken::select('user_id')->where('token', $user_token)->first();
            if(isset($user_id) && !empty($user_id)) {

                $user_data = User::whereIn('id', $user_id)->where('userActivated',1)->where('site_id','=',config('site.profile_key'))->first();
                $returnData = [];
        
                if($user_data) {
                    if($user_data['dob'] == null) {

                    $returnData['personalinfo'] = array(
                        "UserID"=> $user_id,
                        'Title'=>$user_data['title'],
                        'FirstName'=> $user_data['firstname'],
                        'LastName'=> $user_data['lastname'],
                        'Gender'=> $user_data['gender'],
                        'ConvertedDateOfBirth'=> $user_data['dob'],
                        'Year'=> null,
                        'Month'=> null,
                        'Day'=> null,
                        'PhoneExt'=> $user_data['phoneExt'],
                        'Phone'=> $user_data['phoneNumber'],
                        'AltPhoneExt'=> $user_data['altPhoneExt'],
                        'AltPhone'=> $user_data['altPhoneNumber'],
                        'EmergencyContactFirstName'=> $user_data['emergencyFirstName'],
                        'EmergencyContactLastName'=> $user_data['emergencyLastName'],
                        'EmergencyContactPhoneExt'=> $user_data['emergencyPhoneExt'],
                        'EmergencyContactPhone'=> $user_data['emergencyPhoneNumber'],
                        'FirstNameError' => false,
                        'LastNameError' => false,
                        'GenderError' => false,
                        'DateOfBirthError' => false,
                        'PhoneExtError' => false,
                        'PhoneError' => false,
                        'AltPhoneExtError' => false,
                        'AltPhoneError' => false,
                        'EmergencyContactFirstNameError' => false,
                        'EmergencyContactLastNameError' => false,
                        'EmergencyContactPhoneError' => false,
                        'EmergencyContactPhoneExtError' => false,
                    );
                    
                    $returnData['seatingPreference'] = $user_data->seatingPreference == 1 ? true : false;
                    $returnData['redtagRewardsPreference'] = $user_data->redtagRewardsPreference == 1 ? true : false;
                    $returnData['travelReviewsPreference'] = $user_data->travelReviewsPreference == 1 ? true : false;
                    $returnData['surveyPreference'] = $user_data->surveyPreference == 1 ? true : false;
                    $returnData['subscribePreference'] = $user_data->subscribePreference == 1 ? true : false;


                    $returnData['status'] = true;
            
                    return $returnData;

                    } else {
                        
                        $seperate_dob = explode('-',$user_data['dob']);

                    $returnData['personalinfo'] = array(
                        'Title'=>$user_data['title'],
                        'FirstName'=> $user_data['firstname'],
                        'LastName'=> $user_data['lastname'],
                        'Gender'=> $user_data['gender'],
                        'ConvertedDateOfBirth'=> $user_data['dob'],
                        'Year'=> $seperate_dob[0],
                        'Month'=> $seperate_dob[1],
                        'Day'=> $seperate_dob[2],
                        'PhoneExt'=> $user_data['phoneExt'],
                        'Phone'=> $user_data['phoneNumber'],
                        'AltPhoneExt'=> $user_data['altPhoneExt'],
                        'AltPhone'=> $user_data['altPhoneNumber'],
                        'EmergencyContactFirstName'=> $user_data['emergencyFirstName'],
                        'EmergencyContactLastName'=> $user_data['emergencyLastName'],
                        'EmergencyContactPhoneExt'=> $user_data['emergencyPhoneExt'],
                        'EmergencyContactPhone'=> $user_data['emergencyPhoneNumber'],
                        'FirstNameError' => false,
                        'LastNameError' => false,
                        'GenderError' => false,
                        'DateOfBirthError' => false,
                        'PhoneExtError' => false,
                        'PhoneError' => false,
                        'AltPhoneExtError' => false,
                        'AltPhoneError' => false,
                        'EmergencyContactFirstNameError' => false,
                        'EmergencyContactLastNameError' => false,
                        'EmergencyContactPhoneError' => false,
                        'EmergencyContactPhoneExtError' => false,
                    );
                    
                    $returnData['seatingPreference'] = $user_data->seatingPreference == 1 ? true : false;
                    $returnData['redtagRewardsPreference'] = $user_data->redtagRewardsPreference == 1 ? true : false;
                    $returnData['travelReviewsPreference'] = $user_data->travelReviewsPreference == 1 ? true : false;
                    $returnData['surveyPreference'] = $user_data->surveyPreference == 1 ? true : false;
                    $returnData['subscribePreference'] = $user_data->subscribePreference == 1 ? true : false;


                    $returnData['status'] = true;
            
                    return $returnData;
                    }
                    
                } else {
        
                        $returnData['status'] = false;
                        $returnData['message'] = "Oops! Something went wrong, Please try again";
                        return $returnData;
                    }
        } else {
                return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
            }
    }

    public function addTraveler($params)
    {
        
        $data = json_decode($params['data'], true);
       
        $user_token = request()->cookie('authid');
      
        $user_id = UserToken::select('user_id')->where('token', $user_token)->first();
      
        if(isset($user_id) && !empty($user_id)) {
    
        $items = [];

        if (!empty($data['Traveler'])) {
            $TravelerArray = array();
           
            $validator = Validator::make($data['Traveler'], [
                'Title' => ['required', 'string', 'max:255'],
                'FirstName' => ['required', 'string', 'max:255'],
                'LastName' => ['required', 'string', 'max:255'],
                'Gender' => ['required', 'string', 'max:255'],
                //'ConvertedDateOfBirth' => ['required', 'date_format:Y-m-d'],
                'ConvertedDateOfBirth' => ['required'],
                ]);
                if($validator->fails())
                {
                    $returnData['status'] = false;
                    $returnData['message'] = $validator->errors()->first();
                    return $returnData;
                } 
              
                else
              
                {
                    if(isset($data['Traveler']['TravelerId']))
                    {                       
                    $Traveler = Travelers::where('id',$data['Traveler']['TravelerId'])->update([
                        'title' => $data['Traveler']['Title'],
                        'first_name' => $data['Traveler']['FirstName'],
                        'last_name' => $data['Traveler']['LastName'], 
                        'gender' =>  $data['Traveler']['Gender'],
                        'dob' =>  $data['Traveler']['ConvertedDateOfBirth'],
                        ]);  
                    }
                    else
                    {                      
                        $Traveler =  Travelers::create([
                            'user_id' => $user_id->user_id,
                            'title' => $data['Traveler']['Title'],
                            'first_name' => $data['Traveler']['FirstName'],
                            'last_name' => $data['Traveler']['LastName'], 
                            'gender' =>  $data['Traveler']['Gender'],
                            'dob' =>  $data['Traveler']['ConvertedDateOfBirth'],
                        ]);
                    }                
                }
            
            if($Traveler){
                $returnData['status'] = true;
                $returnData['data'] = $Traveler;
                $returnData['message'] = "Traveler data updated successfully !!";
                return $returnData;
            }else{
                $returnData['status'] = false;
                $returnData['message'] = "Oops! Something went wrong, Please try again. ";
                $returnData['data'] = [];
                return $returnData;
            }

        }
    } else {
        return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
    }
        
    }

    public function getTraveler()
    {

        $user_token = request()->cookie('authid');
        $user_id = UserToken::select('user_id')->where('token', $user_token)->first();
        if(isset($user_id) && !empty($user_id)) {
            $returnData = Travelers::where("user_id", $user_id->user_id)->orderBy('id', 'ASC')->get();
        
            $results=[];
                foreach ($returnData as $key => $value) {
                    $seperate_dob = explode('-',$value['dob']);
                    $results['Traveler'][] = array(
                        'TravelerId'=> $value['id'],
                        'UserId'=> $value['user_id'],
                        'Title'=> $value['title'],
                        'FirstName'=> $value['first_name'],
                        'LastName'=> $value['last_name'],
                        'Gender'=> $value['gender'],
                        'ConvertedDateOfBirth'=> $value['dob'],
                        'Year'=> $seperate_dob[0],
                        'Month'=> $seperate_dob[1],
                        'Day'=> $seperate_dob[2],
                    );
                }
    
                if(empty($results)){
                
                    $results['status'] = false;
                    return $results;
                    
                }else {
                    $results['status'] = true;
                    return $results;
                   
                }
        } else {
            return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
        }
       
        
            
    }

    public function deleteTraveler($TravelerId) {
    
        if (!empty($TravelerId)) {
            $user = Travelers::where('id', $TravelerId)->delete();
        }
        if($user){
            $returnData['status'] = true;
            $returnData['data'] = $user;
            return $returnData;
        }else{
            $returnData['status'] = false;
            $returnData['data'] = [];
            return $returnData;
        }
        
    }

    public function getUser()
    {
        $returnData=[];
    
        $user_token = request()->cookie('authid');
        $user_id = UserToken::where('token', $user_token)->first();
        // /dd($user_id);
        if(isset($user_id) && !empty($user_id) && false){
         
            $returnData = User::where("id", $user_id->user_id)->where('site_id','=',config('site.profile_key'))->where('userActivated',1)->first();
    
            // get user profile image
            if(isset($returnData['userProfile'])) {
     
                $returnData['image'] = $returnData['userProfile'];
            } else {
            
                $user_gender = User::where('id', $user_id->user_id)->first();
                
                if(isset($user_gender->gender)) {
                    $returnData['gender'] = $user_gender->gender == 'Male' ? '/img/male.png' : '/img/female.png';
                }
            }

                $results = array(
                    'UserId'=> $returnData['id'],
                    'Name'=> $returnData['firstname'],
                    'Image' =>  $returnData['image'],
                    'Gender' => $returnData['gender']
                );
            return $results;
        } else {
            return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
        }
    }

    public function getUserInfo() {

        $returnData=[];
    
        $user_token = request()->cookie('authid');
        $user_id = UserToken::where('token', $user_token)->first();
        // /dd($user_id);
        if(isset($user_id) && !empty($user_id)){
         
            $returnData = User::where("id", $user_id->user_id)->where('site_id','=',config('site.profile_key'))->where('userActivated',1)->first();
            
            $response = null;
                if(isset($returnData['location'])){
                    $Location = $returnData['location'];
    
                    $Query = SystemCity::select('ID', 'FullName', 'State', 'CountryName','Country')->where('ID','=',$Location)->first();
                    $replace_fullname = str_replace('?', '', $Query['FullName']);
                    if($Query['Country'] == 'US'){
                        $response = ['value' => $Query['ID'], 'label' => $replace_fullname ,'stateLabel' => $Query['State'], 'countryLabel' =>  $Query['CountryName'],'flag' => 'https://redtag-travel-images.s3.us-east-1.amazonaws.com/usa.svg'];
                    }else if($Query['Country'] == 'CA'){
                        $response = ['value' => $Query['ID'], 'label' => $replace_fullname,'stateLabel' => $Query['State'], 'countryLabel' =>  $Query['CountryName'],'flag' => 'https://redtag-travel-images.s3.us-east-1.amazonaws.com/npl.svg'];
                    }
                    else{
                        $response = ['value' => $Query['ID'], 'label' => $replace_fullname ,'stateLabel' => $Query['State'], 'countryLabel' =>   $Query['CountryName'],'flag' => ''];
                    }
            
                }
              
                        
                // get user profile image
                if(isset($returnData['userProfile'])) {
     
                    $returnData['image'] = $returnData['userProfile'];
                } else {
                
                    $user_gender = User::where('id', $user_id->user_id)->first();
                    
                    if(isset($user_gender->gender)) {
                        $returnData['gender'] = $user_gender->gender == 'Male' ? '/img/male.png' : '/img/female.png';
                    }
                }
    
                $results = array(
                    'Name'=> $returnData['firstname'] .' '. $returnData['lastname'],
                    'UserId'=> $returnData['id'],
                    'Location'=> $response,
                    'Image' =>  $returnData['image'],
                    'Gender' => $returnData['gender']
                );
            return $results;
        } else {
            return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
        }
    }

    public function updateLocation($params){
     
        $data = json_decode($params['data'], true);
       
        $user = [];

        $user['data'] = User::where('id', $data['UserId'])->where('userActivated',1)->where('site_id','=',config('site.profile_key'))->update(['location' => $data['Location']['value']]);  
       

        return $user;
    }

    public function profileImage($params) {

        $inputData = json_decode($params['data'], true);


        $user_token = request()->cookie('authid');
        $user_id = UserToken::select('user_id')->where('token', $user_token)->first();

        // $user_data = User::whereIn('id', $user_id)->first();

        $returnData = [];

        if(isset($user_id) && !empty($user_id)) {

            $image_url =  User::where('id', $user_id->user_id)->where('site_id','=',config('site.profile_key'))
                                ->update(['userProfile' => $inputData,
                                    ]);
                                 
            if($image_url) {
               
                $returnData['status'] = true;
                $returnData['data'] = $image_url;
                return $returnData;

            } else {

                $returnData['status'] = false;
                $returnData['message'] = "Oops! Something went wrong, Please try again";
                return $returnData;
            }

        } else {
            return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
        }
       
    }

    public function getEmailPreferences(){}

    public function getUserData($userQuery) {
        if(!empty($userQuery)){
            $userData['userId'] = !empty($userQuery->id) ? $userQuery->id : '';
            $userData['title'] = !empty($userQuery->title) ? $userQuery->title : '';
            $userData['firstname'] = !empty($userQuery->firstname) ? $userQuery->firstname : '';
            $userData['lastname'] = !empty($userQuery->lastname) ? $userQuery->lastname : '';
            $userData['email'] = !empty($userQuery->email) ? $userQuery->email : '';
            $userData['mobile'] = !empty($userQuery->mobile) ? $userQuery->mobile : '';
            $userData['phoneExt'] = !empty($userQuery->phoneExt) ? $userQuery->phoneExt : '';
            $userData['phoneNumber'] = !empty($userQuery->phoneNumber) ? $userQuery->phoneNumber : '';
            $userData['altPhoneExt'] = !empty($userQuery->altPhoneExt) ? $userQuery->altPhoneExt : '';
            $userData['altPhoneNumber'] = !empty($userQuery->altPhoneNumber) ? $userQuery->altPhoneNumber : '';
            $userData['emergencyFirstName'] = !empty($userQuery->emergencyFirstName) ? $userQuery->emergencyFirstName : '';
            $userData['emergencyLastName'] = !empty($userQuery->emergencyLastName) ? $userQuery->emergencyLastName : '';
            $userData['emergencyPhoneExt'] = !empty($userQuery->emergencyPhoneExt) ? $userQuery->emergencyPhoneExt : '';
            $userData['emergencyPhoneNumber'] = !empty($userQuery->emergencyPhoneNumber) ? $userQuery->emergencyPhoneNumber : '';
            $userData['userProfile'] = !empty($userQuery->userProfile) ? $userQuery->userProfile : '';
            $userData['dob'] = !empty($userQuery->dob) ? $userQuery->dob : '';
            $userData['gender'] = !empty($userQuery->gender) ? $userQuery->gender : '';
            $userData['seatingPreference'] = !empty($userQuery->seatingPreference) ? $userQuery->seatingPreference : 0;
            $userData['redtagRewardsPreference'] = !empty($userQuery->redtagRewardsPreference) ? $userQuery->redtagRewardsPreference : 0;
            $userData['travelReviewsPreference'] = !empty($userQuery->travelReviewsPreference) ? $userQuery->travelReviewsPreference : 0;
            $userData['subscribePreference'] = !empty($userQuery->subscribePreference) ? $userQuery->subscribePreference : 0;
            $userData['surveyPreference'] = !empty($userQuery->surveyPreference) ? $userQuery->surveyPreference : 0;
            return $userData;
        }else{
            return [];
        }
    }

    public function getTravelerInfo($travelQuery) {
        $travelData = [];
        if(!empty($travelQuery)){
            foreach ($travelQuery as $item) {
                $tempArray['title'] = !empty($item->title) ? $item->title : '';
                $tempArray['first_name'] = !empty($item->first_name) ? $item->first_name : '';
                $tempArray['last_name'] = !empty($item->last_name) ? $item->last_name : '';
                $tempArray['gender'] = !empty($item->gender) ? $item->gender : '';
                $tempArray['dob'] = !empty($item->dob) ? $item->dob : '';
                array_push($travelData,$tempArray);
            }
        }
        return $travelData;
    }

    public function getTravelerData($params) {
        $returnData['status'] = false;
        $returnData['data'] = [];

        if(isset($params['authToken'])){
            $user_token = $params['authToken'];
            $userInfo = UserToken::select('user_id')->where('token', $user_token)->whereNotNull('user_id')->first();
    
            if (!empty($userInfo->user_id)) {
                $userQuery = User::where('id', $userInfo->user_id)->where('userActivated',1)->first();
                $userData = $this->getUserData($userQuery);
                if(!empty($userData)){
                    $travelQuery = Travelers::where('user_id', $userInfo->user_id)->get();
                    $travelData = $this->getTravelerInfo($travelQuery);
    
                    $returnData['status'] = true;
                    $returnData['data']['user'] = $userData;
                    $returnData['data']['traveler'] = $travelData;
                }
            }
        }
        return $returnData;
    }

    public function getMyTrip() {
        
        $user_token = request()->cookie('authid');
        $user_id = UserToken::where('token', $user_token)->first();
        // /dd($user_id);
        if(isset($user_id) && !empty($user_id)){
         
            $user_data = User::where("id", $user_id->user_id)->where('site_id','=',config('site.profile_key'))->where('userActivated',1)->first();
            $returnData=[];
            $returnData['Upcoming'] = array();
            $returnData['Past'] = array();

            if($user_data) {

                $user_trip = UserBookings::where('userId', $user_data->id)->get();
       
                    foreach($user_trip as $trip) {

                        // find current date
                        $currentDate = date('Y-m-d');
                        $currentDate = date(strtotime($currentDate));
                 
                        $sdate = $trip->startDate;
                        $edate = $trip->endDate;
                        $start_date = strtotime($trip->startDate); // convert to timestamps
                        $end_date = strtotime($trip->endDate); // convert to timestamps
                        // $days = (int)(($end_date - $start_date)/86400); 
                        
                        $converted_start_date= date('D, d M',strtotime($trip->startDate));
                        $converted_end_date= date('D, d M',strtotime($trip->endDate));

                        if($trip->bookingType == 1) {

                            $icon = '/img/icons/icon-defs.svg#icon-plane-right';
                        } else if($trip->bookingType == 2) {
                            
                            $icon = '/img/icons/icon-defs.svg#icon-bed-stars';
                        } else if($trip->bookingType == 3) {
                            
                            $icon = '/img/icons/icon-defs.svg#icon-flight-hotel';
                        } else if($trip->bookingType == 4) {

                            $icon = '/img/icons/icon-defs.svg#icon-car';
                        } else if($trip->bookingType == 5) {
                            
                            $icon = '/img/icons/icon-defs.svg#icon-ship';
                        }

                        if (($currentDate <= $end_date)){ 

                            $days = (int)(($end_date - $currentDate)/86400);
                            
                            $returnData['Upcoming'][] = array(
                                'Name' => $trip->bookingName,
                                'Duration' => $days,
                                'Type' => $icon,
                                'StartDate' => $converted_start_date,
                                'EndDate' =>  $converted_end_date,
                                'Itinerary' => $trip->itineraryNumber,
                                'URL' => $trip->URL,
                                'Status' => $trip->status
                            );
                        } else{    

                            $returnData['Past'][] = array(
                                'Name' => $trip->bookingName,
                                'Type' => $icon,
                                'StartDate' => $converted_start_date,
                                'EndDate' =>  $converted_end_date,
                                'Itinerary' => $trip->itineraryNumber,
                                'URL' => $trip->URL,
                                'Status' => $trip->status
                            );
                            
                        }
                 
                    }
                
                $returnData['status'] = true;
                return $returnData;
            

            } else {
                return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
            }
            
        } else {
            return response()->json(['error' => 'Unauthenticated.', 'code' => 401]);
        }
    }
}
