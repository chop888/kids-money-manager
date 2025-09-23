package com.example.app.entity;

import lombok.Data;

/**
 * カテゴリエンティティ
 * データベースのrecordsテーブルと1対1で対応
 */

@Data
public class Category {
	
	private Integer categoryId;
	private String categoryName;
	private String recordType;
	private Integer displayOrder;

}
