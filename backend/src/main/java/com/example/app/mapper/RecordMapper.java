package com.example.app.mapper;//収支記録のデータベース操作

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.dto.RecordSearchDto;
import com.example.app.entity.Record;

@Mapper
public interface RecordMapper {
	int insertRecord(Record record);//収支記録登録
	int updateRecord(Record record);//記録更新
	int deleteRecord(@Param("recordId") Integer recordId);//記録削除
	Record findById(@Param("recordId") Integer recordId);//記録IDで検索
	List<Record> findByUserId(@Param("userId") Integer userId);//ユーザーIDで全記録取得
	
	//検索・フィルタリング
	List<Record> searchRecords(RecordSearchDto searchDto);//検索条件で記録取得
	
	//集計・計算
	Integer calculateBalance(@Param("userId") Integer userId);//ユーザーの残高計算
	Map<String, Object> getBalanceSummary(@Param("userId") Integer userId);//収支サマリ―
}
