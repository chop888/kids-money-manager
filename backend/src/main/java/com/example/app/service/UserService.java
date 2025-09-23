package com.example.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.dto.UserLoginDto;
import com.example.app.dto.UserRegistrationDto;
import com.example.app.entity.User;
import com.example.app.mapper.UserMapper;
import com.example.app.util.PasswordUtil;

@Service
@Transactional
public class UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	/**
	 * ユーザー登録
	 * @param registrationDto　ユーザー登録データ
	 * @return　登録されたユーザー情報
	 */
	
	public User registerUser(UserRegistrationDto registrationDto) {
		//ニックネームの重複チェック
		User existingUser = userMapper.findByNickname(registrationDto.getNickname());
		if(existingUser != null) {
			throw new RuntimeException("このニックネームはほかの人がつかってるよ");
		}
		
		//パスワードの強度チェック
		if(!PasswordUtil.checkPasswordStrength(registrationDto.getPassword())) {
			throw new RuntimeException("パスワードはローマ字と数字ときごうをつかってね");
		}
		
		//パスワードをハッシュ化
		String hashedPassword = PasswordUtil.hashPassword(registrationDto.getPassword());
		
		
		//ユーザーエンティティの作成
		User user = new User();
		user.setLastName(registrationDto.getLastName());
		user.setFirstName(registrationDto.getFirstName());
		user.setNickname(registrationDto.getNickname());
		user.setPassword(hashedPassword);//ハッシュ化されたパスワードを設定
		
		//データベースに保存
		userMapper.insertUser(user);
		
		return user;
	}
	
	
	/**
	 * ユーザーログイン認証
	 * @param loginDto　ログインデータ
	 * @return　認証成功時のユーザー情報
	 */
	public User authenticateUser(UserLoginDto loginDto) {
		//ニックネームでユーザーを検索
		User user = userMapper.findByNickname(loginDto.getNickname());
		if(user == null) {
			throw new RuntimeException("ユーザーがみつからないよ");
		}
		
		//パスワード検証(ハッシュ化対応)
		if(!PasswordUtil.verifyPassword(loginDto.getPassword(), user.getPassword())) {
			throw new RuntimeException("ニックネームまたはパスワードがまちがっているよ");
		}
		
		return user;
		
	}
	
	
	/**
	 * ユーザー情報取得(ニックネーム)
	 * @param nickname ニックネーム
	 * @return　ユーザー情報
	 */
	public User getUserByNickname(String nickname) {
		if(nickname == null || nickname.trim().isEmpty()) {
			throw new RuntimeException("ニックネームが入力されていないよ");
		}
		
		User user = userMapper.findByNickname(nickname);
		if(user == null) {
			throw new RuntimeException("ニックネームがみつからないよ");
		}
		return user;
		
	}
	
	//ユーザーログアウト
	public boolean logoutUser(String nickname) {
		
		return true;
	}

}
