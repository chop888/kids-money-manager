package com.example.app.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * パスワードハッシュ化と認証を行うユーティリティクラス
 * jBCryptライブラリを使用してセキュアなパスワード管理を実現
 */

public class PasswordUtil {
	
	/**
	 * パスワードをハッシュ化する
	 * @param plainPassword 平文のパスワード
	 * @return　ハッシュ化されたパスワード
	 */
	public static String hashPassword(String plainPassword) {
		//入力値の検証
		if(plainPassword == null || plainPassword.trim().isEmpty()){
			throw new IllegalArgumentException("パスワードを入力してね");
		}
		
		//パスワードの長さチェック
		if(plainPassword.length() < 8) {
			throw new IllegalArgumentException("パスワードは8文字いじょうで入力してね");
		}
		
		//jBCryptを使用してパスワードをハッシュ化
		//デフォルトで１０回のラウンドでハッシュ化(セキュリティレベル：中)
		String hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt());
		
		return hashedPassword;
	}
	
	/**
	 * パスワードの認証を行う
	 * @param plainPassword 平文のパスワード(ログイン時に入力されたもの)
	 * @param hashedPassword ハッシュ化されたパスワード(データベースに保存されているもの)
	 * @return　認証成功の場合true,　失敗の場合はfalse
	 */
	public static boolean verifyPassword(String plainPassword, String hashedPassword) {
		//入力値の検証
		if(plainPassword == null || plainPassword.trim().isEmpty()) {
			return false;//パスワードが入力されていない場合は認証失敗
		}
		
		if(hashedPassword == null || hashedPassword.trim().isEmpty()) {
			return false; //ハッシュ化されたパスワードが存在しない場合は認証失敗
		}
		
		try {
			//jBCryptを使用してパスワードを検証
			//BCrypt.checkpw()は平文パスワードとハッシュ化されたパスワードを比較
			boolean isMatch = BCrypt.checkpw(plainPassword, hashedPassword);
			
			return isMatch;
			
		}catch(Exception e) {
			//ハッシュ化されたパスワードの形式が不正な場合など
			return false;
		}
	}
	
	/**
	 * パスワードの強度をチェックする
	 * @param plainPassword 平文のパスワード
	 * @return 強度チェック結果
	 */
	public static boolean checkPasswordStrength(String plainPassword) {
		if(plainPassword == null || plainPassword.trim().isEmpty()) {
			return false;
		}
		
		//パスワードの長さチェック
		if(plainPassword.length() < 8) {
			return false;
		}
		
		//文字種のチェック(ローマ字、数字、記号の組み合わせ)
		boolean hasLetter = plainPassword.matches(".*[a-zA-Z].*");
		boolean hasDigit = plainPassword.matches(".*[0-9].*");
		boolean hasSymbol = plainPassword.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
		
		//数字、ローマ字、記号全てを含む必要がある
		return hasLetter && hasDigit && hasSymbol;
	}
	
	

}
