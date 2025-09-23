package com.example.app.mapper;//ユーザー管理のデータベース操作

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.User;

@Mapper
public interface UserMapper {
	
	int insertUser(User user);//ユーザー登録
	User findByNickname(@Param("nickname") String nickname);//ニックネームでユーザー検索(ログイン用)
	User findById(@Param("userId") Integer userId);//ユーザーIDでユーザー検索
	List<User> findAll();//全ユーザー取得
	int updateUser(User user);//ユーザー更新
	int deleteUser(@Param("userId") Integer userId);//ユーザー削除
	

}
