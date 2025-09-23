package com.example.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.dto.RecordDto;
import com.example.app.dto.RecordSearchDto;
import com.example.app.entity.Record;
import com.example.app.mapper.RecordMapper;

@Service
@Transactional
public class RecordService {
	
	@Autowired
	private RecordMapper recordMapper;
	
	/**
	 * 収支記録登録
	 * @param recordDto　収支記録データ
	 * @param userId　ユーザーID
	 * @return　登録された収支記録
	 */
	public Record createRecord(RecordDto recordDto, Integer userId) {
		//入力値の検証
		if(recordDto == null) {
			throw new RuntimeException("もらった・つかったが入力されていないよ");
		}
		
		if(userId == null) {
			throw new RuntimeException("ログインのじょうほうがまちがっているよ。もう1回ログインしてね");
		}
		
		//金額の検証
		if(recordDto.getAmount() == null || recordDto.getAmount() <= 0) {
			throw new RuntimeException("0より大きい数を入力してね");
		}
		
		//カテゴリーの検証
		if(recordDto.getCategory() == null || recordDto.getCategory().isEmpty()) {
			throw new RuntimeException("カテゴリーをえらんでね");
		}
		
		//収支記録エンティティの作成
		Record record = new Record();
		record.setUserId(userId);
		record.setRecordDate(recordDto.getRecordDate()); //フロントエンドで必ず設定
		record.setRecordType(recordDto.getRecordType()); //フロントエンドで必ず設定
		record.setAmount(recordDto.getAmount());
		record.setCategory(recordDto.getCategory());
		record.setMemo(recordDto.getMemo());
		
		//データベースを更新
		recordMapper.insertRecord(record);
		
		return record;
	}
	
	/**
	 * 収支記録更新
	 * @param recordId 更新する記録ID
	 * @param recordDto　更新データ
	 * @param userId　ユーザーID
	 * @return　更新された収支記録
	 */

	public Record updateRecord(Integer recordId, RecordDto recordDto, Integer userId) {
		//入力値の検証
		if(recordId == null) {
			throw new RuntimeException("きろくIDがせっていされていないよ");
		}
		
		if(recordDto == null) {
			throw new RuntimeException("なおすデータが入力されていないよ");
		}
		
		if(userId == null) {
			throw new RuntimeException("ログインのじょうほうがまちがっているよ。もう1回ログインしてね");
		}
		//既存記録の存在チェック
		Record existingRecord = recordMapper.findById(recordId);
		if(existingRecord == null) {
			throw new RuntimeException("なおすきろくが見つからないよ");
		}
		
		//金額の検証
		if(recordDto.getAmount() == null || recordDto.getAmount() <= 0) {
			throw new RuntimeException("0より大きい数を入力してね");
		}
		
		//収支記録エンティティの更新
		Record record = new Record();
		record.setRecordId(recordId);
		record.setUserId(userId);
		record.setRecordDate(recordDto.getRecordDate());
		record.setRecordType(recordDto.getRecordType());
		record.setAmount(recordDto.getAmount());
		record.setCategory(recordDto.getCategory());
		record.setMemo(recordDto.getMemo());
		
		//データベースを更新
		recordMapper.updateRecord(record);
		
		return record;
	}
	
	/**
	 * 収支記録削除
	 * @param recordId 削除する記録ID
	 * @param userId　ユーザーID
	 * @return　削除成功の場合true
	 */
	
	public boolean deleteRecord(Integer recordId, Integer userId) {
		//入力値の検証
		if(recordId == null) {
			throw new RuntimeException("きろくIDがせっていされていないよ");
		}
		if(userId == null) {
			throw new RuntimeException("ログインのじょうほうがまちがっているよ。もう1回ログインしてね");
		}
		
		//既存記録の存在チェック
		Record existingRecord = recordMapper.findById(recordId);
		if(existingRecord == null) {
			throw new RuntimeException("けしたいきろくが見つからないよ");
		}
		
		//データベースから削除
		recordMapper.deleteRecord(recordId);
		
		return true;
	}
	
	/**
	 * 収支記録検索
	 * @param searchDto 検索条件
	 * @return　検索結果の収支記録リスト
	 */
	public List<Record> searchRecords(RecordSearchDto searchDto){
		//入力値の検証
		if(searchDto == null) {
			throw new RuntimeException("さがすものがせっていされていないよ");
		}
		
		//検索実行
		return recordMapper.searchRecords(searchDto);
	}
	
	/**
	 * ユーザーIDによる収支記録取得
	 * @param userId ユーザーID
	 * @return　ユーザーの収支記録リスト
	 */
	public List<Record> getRecordsByUserId(Integer userId){
		if(userId == null) {
			throw new RuntimeException("ユーザーIDがせっていされていないよ");
		}
		
		return recordMapper.findByUserId(userId);
	}
	
	/**
	 * 記録IDによる収支記録取得
	 * @param recordId 記録ID
	 * @return　収支記録
	 */
	
	public Record getRecordById(Integer recordId) {
		if(recordId == null) {
			throw new RuntimeException("きろくIDがせっていされていないよ");
		}
		return recordMapper.findById(recordId);
	}
}
