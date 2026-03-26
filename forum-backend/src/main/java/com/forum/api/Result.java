package com.forum.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.forum.common.enums.ResultCode;
import lombok.Data;

import java.io.Serializable;
import java.time.Instant;

/**
 * 统一响应格式
 * @param <T> 数据类型
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 响应码
     */
    private Integer code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 错误详情
     */
    private Object errors;

    /**
     * 时间戳
     */
    private Long timestamp;

    public Result() {
        this.timestamp = Instant.now().toEpochMilli();
    }

    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now().toEpochMilli();
    }

    /**
     * 成功响应
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", null);
    }

    /**
     * 成功响应（带数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }

    /**
     * 成功响应（带消息和数据）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> error() {
        return new Result<>(500, "操作失败", null);
    }

    /**
     * 失败响应（带消息）
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }

    /**
     * 失败响应（带状态码和消息）
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 失败响应（带状态码、消息和错误详情）
     */
    public static <T> Result<T> error(Integer code, String message, Object errors) {
        Result<T> result = new Result<>(code, message, null);
        result.setErrors(errors);
        return result;
    }

    /**
     * 失败响应（带 ResultCode 枚举）
     */
    public static <T> Result<T> error(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMessage(), null);
    }

    /**
     * 失败响应（带 ResultCode 枚举和错误详情）
     */
    public static <T> Result<T> error(ResultCode resultCode, Object errors) {
        Result<T> result = new Result<>(resultCode.getCode(), resultCode.getMessage(), null);
        result.setErrors(errors);
        return result;
    }

    /**
     * 参数错误响应
     */
    public static <T> Result<T> badRequest(String message) {
        return new Result<>(400, message, null);
    }

    /**
     * 未认证响应
     */
    public static <T> Result<T> unauthorized() {
        return new Result<>(401, "未登录或登录已过期", null);
    }

    /**
     * 未认证响应（带消息）
     */
    public static <T> Result<T> unauthorized(String message) {
        return new Result<>(401, message, null);
    }

    /**
     * 无权限响应
     */
    public static <T> Result<T> forbidden() {
        return new Result<>(403, "无权限访问", null);
    }

    /**
     * 无权限响应（带消息）
     */
    public static <T> Result<T> forbidden(String message) {
        return new Result<>(403, message, null);
    }

    /**
     * 资源不存在响应
     */
    public static <T> Result<T> notFound(String message) {
        return new Result<>(404, message, null);
    }
}
