<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
          'name'=>'531846872',
          'email'=>'531846872@qq.com',
          'password'=>bcrypt('admin'),
        ]);
    }
}
