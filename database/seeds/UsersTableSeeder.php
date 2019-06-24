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
          'name'=>'cui haokang',
          'email'=>'531846872@qq.com',
          'password'=>bcrypt('cuihaokang123'),
        ]);
    }
}
