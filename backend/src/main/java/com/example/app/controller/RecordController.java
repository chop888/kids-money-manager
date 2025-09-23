package com.example.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.dto.RecordDto;
import com.example.app.dto.RecordSearchDto;
import com.example.app.entity.Record;
import com.example.app.service.RecordService;

@RestController
@RequestMapping("/kids")
@CrossOrigin(origins = "*")//フロントエンドからのアクセスを許可
public class RecordController {

	@Autowired //RecordServiceを自動注入
	private RecordService recordService;

	/**
	 * 収支記録登録API
	 * @param recordDto 収支記録データ
	 * @param userId　ユーザーID
	 * @return　登録結果
	 */
	@PostMapping("/records")//POST /kids/records?userId=1
	public ResponseEntity<Map<String, Object>> createRecord(
			@RequestBody RecordDto recordDto,
			@RequestParam Integer userId){
		try {
			//RecordServiceのcreateRecord()メソッドを呼び出し
			Record createRecord = recordService.createRecord(recordDto, userId);

			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "きろくをとうろくしたよ！");
			response.put("record", createRecord);

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
	 * 収支記録更新API
	 * @param recordId 更新する記録ID
	 * @param recordDto　更新データ
	 * @param userId　ユーザーID
	 * @return　更新結果
	 */
	@PutMapping("/records/{recordId}")//PUT kids/records/1?userId=1
	public ResponseEntity<Map<String, Object>> updateRecord(
			@PathVariable Integer recordId,
			@RequestBody RecordDto recordDto,
			@RequestParam Integer userId){
		try {
			//RecordServiceのupdateRecord()メソッドを呼び出し
			Record updateRecord = recordService.updateRecord(recordId, recordDto, userId);

			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "きろくをこうしんしたよ！");
			response.put("record", updateRecord);

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
	 * 収支記録削除API
	 * @param recordId 削除する記録ID
	 * @param userId　ユーザーID
	 * @return　削除結果
	 */
	@DeleteMapping("/records/{recordId}")
	public ResponseEntity<Map<String, Object>> deleteRecord(
			@PathVariable Integer recordId,
			@RequestParam Integer userId){
		try {
			//RecordServiceのdeleteRecord()メソッドを呼び出し
			boolean deleteResult = recordService.deleteRecord(recordId, userId);

			if(deleteResult) {
				//成功レスポンスを作成
				Map<String, Object> response = new HashMap<>();
				response.put("success", true);
				response.put("message", "きろくをけしたよ！");

				return ResponseEntity.ok(response);

			}else {
				//削除失敗
				Map<String, Object> response = new HashMap<>();
				response.put("success", false);
				response.put("message", "きろくがけせなかったよ");

				return ResponseEntity.badRequest().body(response);
			}

		}catch(RuntimeException e) {
			//エラーレスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());

			return ResponseEntity.badRequest().body(response);
		}
	}

	/**
	 * 収支記録検索API
	 * @param searchDto 検索条件
	 * @return　検索結果
	 */
	@PostMapping("/records/search")
	public ResponseEntity<Map<String, Object>> searchRecords(@RequestBody RecordSearchDto searchDto){
		try {
			//RecordServiseのsearchRecords()メソッドを呼び出し
			List<Record> records = recordService.searchRecords(searchDto);

			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "けんさくがおわったよ！");
			response.put("records", records);
			response.put("count", records.size());

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
	 * ユーザーの収支記録一覧取得API
	 * @param userId ユーザーID
	 * @return　ユーザーの収支記録一覧
	 */
	@GetMapping("/user/{userId}/records")
	public ResponseEntity<Map<String, Object>> getRecordByUserId(@PathVariable Integer userId){
		try {
			//RecordServiceのgetRecordByUserId()メソッドを呼び出し
			List<Record> records = recordService.getRecordsByUserId(userId);

			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "もらった・つかったのきろくをよみこんだよ！");
			response.put("records", records);
			response.put("count", records.size());

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
	 * 記録IDによる収支記録取得
	 * @param recordId 記録ID
	 * @return　収支記録
	 */
	@GetMapping("/records/{recordId}")
	public ResponseEntity<Map<String, Object>> getRecordById(@PathVariable Integer recordId){
		try {
			//RecordServiceのgetRecordById()メソッドを呼び出し
			Record record = recordService.getRecordById(recordId);

			//成功レスポンスを作成
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "もらった・つかったのきろくをよみこんだよ！");
			response.put("record", record);

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
