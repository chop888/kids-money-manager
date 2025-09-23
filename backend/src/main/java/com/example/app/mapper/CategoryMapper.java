package com.example.app.mapper;//カテゴリー管理のデータベース操作

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.Category;

@Mapper
public interface CategoryMapper {
	
	//全カテゴリー取得
	List<Category> findAll();
	
	//タイプ別カテゴリー取得
	List<Category> findByRecordType(@Param("recordType") String RecordType);
	

	//IDによるカテゴリー取得
	Category findById(@Param("categoryId") Integer categoryId);
	
	//名前によるカテゴリー取得
	Category findByName(@Param("categoryName") String categoryName);
}
