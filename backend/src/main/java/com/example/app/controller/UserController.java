package com.example.app.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.dto.UserLoginDto;
import com.example.app.dto.UserRegistrationDto;
import com.example.app.entity.User;
import com.example.app.service.UserService;

@RestController //APIコントローラー
@RequestMapping("/kids")
@CrossOrigin(origins = "*") //フロントエンドからのアクセスを許可
public class UserController {
	
	@Autowired
	private UserService userService;
	
	/**
	 * ユーザー登録
	 * @param registrationDto 登録データ
	 * @return　登録結果
	 */
	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody UserRegistrationDto registrationDto){
		try {
			//ユーザー登録を実行
			User registeredUser = userService.registerUser(registrationDto);
		
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "とうろくせいこう！");
			response.put("nickname", registeredUser.getNickname());
			
			return ResponseEntity.ok(response);
			
		}catch(RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			
			return ResponseEntity.badRequest().body(response);
			
		}
		
	}
	
	/**
	 * ユーザーログイン
	 * @param loginDto ログインデータ
	 * @return　ログイン結果
	 */
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> loginUser(@RequestBody UserLoginDto loginDto){
		try {
			//ユーザーログインを実行
			User loggedInUser = userService.authenticateUser(loginDto);
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "ログインがせいこうしたよ！");
			response.put("userId", loggedInUser.getUserId());
			response.put("nickname", loggedInUser.getNickname());
			
			return ResponseEntity.ok(response);
			
		}catch(RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			
			return ResponseEntity.badRequest().body(response);
		}
	}

	/**
	 * ユーザー情報取得
	 * @param userId ユーザーID
	 * @return　ユーザー情報
	 */
	@GetMapping("/{nickname}")
	public ResponseEntity<Map<String, Object>> getUserInfo(@PathVariable String nickname){
		try {
			//ユーザー情報を取得
			User user = userService.getUserByNickname(nickname);
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("user", user);
			
			return ResponseEntity.ok(response);
		}catch(RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			
			return ResponseEntity.badRequest().body(response);
		}
		
	}
	
	/**
	 * ユーザーログアウト
	 */
	@PostMapping("/{nickname}/logout")
	public ResponseEntity<Map<String, Object>> logoutUser(@PathVariable String nickname){
		try {
			//ユーザーログアウトを実行
			userService.logoutUser(nickname);
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "ログアウトしたよ！");
			
			return ResponseEntity.ok(response);
			
		}catch (RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			
			return ResponseEntity.badRequest().body(response);
		}
	}
}
