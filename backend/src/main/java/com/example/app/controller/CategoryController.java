package com.example.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.entity.Category;
import com.example.app.service.CategoryService;

@RestController //APIコントローラーとして設定
@RequestMapping("/kids")//ベースURLパスを指定
@CrossOrigin(origins = "*")//フロントエンドからのアクセスを許可
public class CategoryController {

	@Autowired //CategoryServiceを自動注入
	private CategoryService categoryService;
	
	/**
	 * 全カテゴリー取得API
	 * @return　全カテゴリーのリスト
	 */
	
	@GetMapping("/categories")//GET /kids/categories
	public ResponseEntity<Map<String, Object>> getAllCategories(){
		try {
			//categoryServiceのgetAllCategory()メソッドを呼び出し
			List<Category> categories = categoryService.getAllCategories();
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "カテゴリーをよみこんだよ！");
			response.put("categories", categories);
			
			return ResponseEntity.ok(response); //HTTP 200 OK
			
		}catch(RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			
			return ResponseEntity.badRequest().body(response);//HTTP 400 Bad Request
		}
	}
	
	/**
	 * 収支タイプ別カテゴリー取得API
	 * @param recordType 収支タイプ("received" or "spent")
	 * @return　指定されたタイプのカテゴリーリスト
	 */
	@GetMapping("/categories/{recordType}")//Get kids/categories/received または /kids/categories/spent
	public ResponseEntity<Map<String, Object>> getCategoriesByType(@PathVariable String recordType){
		try {
			//CategoryServiceのgetCategoriesByType()メソッドを呼び出し
			List<Category> categories = categoryService.getCategoriesByType(recordType);
			
			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", recordType + "のカテゴリーをよみこんだよ！");
			response.put("categories", categories);
			
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
