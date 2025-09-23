package com.example.app.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.service.BalanceService;

@RestController
@RequestMapping("/kids")
@CrossOrigin(origins = "*")
public class BalanceController {
	
	@Autowired
	private BalanceService balanceService;
	
	/**
	 * ユーザーの残高取得API
	 * @param userId ユーザーID
	 * @return　ユーザーの現在の残高
	 */
	@GetMapping("/users/{userId}/balance")
	public ResponseEntity<Map<String, Object>>  getUserCurrentBalance(@PathVariable Integer userId){
		try {
			//BalanceServiceのgetCurrent()メソッドを呼び出し
			Integer currentBalance = balanceService.getCurrent(userId);
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "のこりのお金をよみこんだよ！");
			response.put("balance", currentBalance);
			response.put("userId", userId);
			
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
	 * ユーザーの収支サマリー取得API
	 * @param userId ユーザーID
	 * @return　
	 */
	@GetMapping("/users/{userId}/balance/summary")
	public ResponseEntity<Map<String, Object>> getUserBalanceSummary(@PathVariable Integer userId){
		try {
			//BalanceServiceのgetBalanceSummary()メソッドを呼び出し
			Map<String, Object> balanceSummary = balanceService.getBalanceSummary(userId);
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "お金のきろくのまとめをよみこんだよ！");
			response.put("balanceSummary", balanceSummary);
			response.put("userId", userId);
			
			return ResponseEntity.ok(response);
			
		}catch(RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			
			return ResponseEntity.badRequest().body(response);
		}
	}	

}
