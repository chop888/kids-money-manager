package com.example.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.entity.Category;
import com.example.app.mapper.CategoryMapper;

@Service
@Transactional
public class CategoryService {

	@Autowired
	private CategoryMapper categoryMapper;
	
	/**
	 * 全カテゴリーの取得
	 * @return　全カテゴリーのリスト
	 */
	
	public List<Category> getAllCategories(){
		return categoryMapper.findAll();
	}
	
	/**
	 * 収支タイプ別カテゴリー取得
	 * @param recordType　収支タイプ("received" or "spent")
	 * @return 指定されたタイプのカテゴリーリスト
	 */
	public List<Category> getCategoriesByType(String recordType){
		if(recordType == null || recordType.isEmpty()) {
			throw new RuntimeException("タイプがせっていされていないよ");
		}
		
		if(!"received".equals(recordType) && !"spent".equals(recordType)) {
			throw new RuntimeException("ただしいタイプをえらんでね");
		}
		
		return categoryMapper.findByRecordType(recordType);
	}
	

	/**
	 * カテゴリーIDによる取得
	 * @param categoryId　カテゴリーID
	 * @return　カテゴリー取得
	 */
	public Category getCategoryById(Integer categoryId) {
		if(categoryId == null) {
			throw new RuntimeException("カテゴリーIDがせっていされていないよ");
		}
		
		Category category = categoryMapper.findById(categoryId);
		if(category == null) {
			throw new RuntimeException("カテゴリーが見つからないよ");
		}
		
		return category;
	}
	
	/**
	 * カテゴリー名による取得
	 * @param categoryName　カテゴリー名
	 * @return　カテゴリー情報
	 */
	public Category getCategoryByName(String categoryName) {
		if(categoryName == null || categoryName.isEmpty()) {
			throw new RuntimeException("カテゴリーをえらんでね");
		}
		return categoryMapper.findByName(categoryName);
	}
	
	/**
	 * カテゴリー存在チェック
	 * @param categoryName　カテゴリー名
	 * @return　存在する場合true
	 */
	public boolean existsCategory(String categoryName) {
		if(categoryName == null || categoryName.isEmpty()) {
			return false;
		}
		
		Category category = categoryMapper.findByName(categoryName);
		return category != null;
	}
}
