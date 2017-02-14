package xd.fw.util;

/**
 * Created by xd on 2015/10/31.
 */
public class FwException extends RuntimeException {
    private int errorCode;
    public FwException(String msg, Throwable e){
        super(msg,e);
    }

    public FwException(String msg){
        super(msg);
    }
    public FwException(int errorCode, String msg){
        this(msg);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }
}
