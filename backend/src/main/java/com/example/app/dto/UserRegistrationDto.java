package com.example.app.dto;//ユーザー登録時のデータ受け取り

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class UserRegistrationDto {
	
	@NotBlank(message = "みょうじを入力してね")
	@Size(max = 50, message = "みょうじは50文字いないで入力してね")
	private String lastName;
	
	@NotBlank(message = "なまえを入力してね")
	@Size(max = 50, message = "なまえは50文字いないで入力してね")
	private String firstName;
	
	@NotBlank(message = "ニックネームを入力してね")
	@Size(min = 6, max = 30, message = "ニックネームは6文字いじょうで入力してね")
	@Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*()_+\\\\-=\\\\[\\\\]{};':\\\"\\\\\\\\|,.<>\\\\/?]+$",
	                  message = "ニックネームはローマ字・数字・きごうをくみ合わせてね")
	private String nickname;
	
	@NotBlank(message = "パスワードを入力してね")
	@Size(min = 8, max = 255, message = "パスワードは8文字いじょうで入力してね")
	@Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*()_+\\\\-=\\\\[\\\\]{};':\\\"\\\\\\\\|,.<>\\\\/?]+$",
	                 message = "パスワードはローマ字・数字・きごうをくみ合わせてね")
	private String password;

}
