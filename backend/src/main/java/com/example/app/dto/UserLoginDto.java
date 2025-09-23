package com.example.app.dto;//ログイン時のデータ受け取り

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UserLoginDto {
	
	@NotBlank(message = "ニックネームを入力してね")
	private String nickname;
	
	@NotBlank(message = "パスワードを入力してね")
	private String password;
	
}
