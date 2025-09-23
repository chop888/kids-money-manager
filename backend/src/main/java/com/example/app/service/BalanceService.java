package com.example.app.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.mapper.RecordMapper;

@Service
@Transactional
public class BalanceService {
	
	@Autowired
	private RecordMapper recordMapper;
	
	/**
	 * ユーザーの現在残高を取得
	 * @param userId ユーザーID
	 * @return　現在の残高
	 */
	public Integer getCurrent(Integer userId) {
		if(userId == null) {
			throw new RuntimeException("ログインのじょうほうがまちがっているよ。もう1回ログインしてね");
		}
	//RecordMapperのcalculateBalanceメソッドを使用
		Integer balance = recordMapper.calculateBalance(userId);
		
		//nullの場合は0を返す
		return balance != null ? balance : 0;
	}
	
	/**
	 * ユーザーの収支サマリーを取得
	 * @param userId ユーザーID
	 * @return　収支サマリー(総収入、総支出、残高)
	 */
	public Map<String, Object> getBalanceSummary(Integer userId){
		if(userId == null) {
			throw new RuntimeException("ログインのじょうほうがまちがっているよ。もう1回ログインしてね"); 
		}
		
		return recordMapper.getBalanceSummary(userId);
	}
}
