package xd.fw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import xd.fw.bean.Mod;
import xd.fw.dao.ModRepository;
import xd.fw.dao.RoleRepository;

import java.util.List;

@Controller
@RequestMapping("mod")
public class ModController extends BaseController{

    @Autowired
    ModRepository modRepository;
    @Autowired
    RoleRepository roleRepository;

    @RequestMapping("obtainModsByRole")
    @ResponseBody
    public List<Mod> obtainModsByRole(int roleId) throws Exception{
        return roleRepository.findOne(roleId).getMods();
    }

    @RequestMapping("obtainMods")
    @ResponseBody
    public PageContent obtainMods(int page, int limit){
        Page<Mod> mods = modRepository.findAll(pageRequest(page, limit));
        return page(mods);
    }

    @RequestMapping("deleteMod")
    @ResponseBody
    public String deleteMod(int[] modIds) {
        for (int id : modIds){
            modRepository.delete(id);
        }
        return DONE;
    }

    @RequestMapping("saveMod")
    @ResponseBody
    public String saveMod(Mod mod) throws Exception {
        modRepository.save(mod);
        return DONE;
    }
}