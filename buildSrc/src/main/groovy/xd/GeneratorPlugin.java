package xd;

import org.gradle.api.DefaultTask;
import org.gradle.api.Project;
import org.gradle.api.tasks.TaskAction;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

/**
 * Created by xd on 3/28/2017.
 */
public class GeneratorPlugin extends DefaultTask {

    @TaskAction
    public void dao() throws Exception {
        Project project = getProject();
        String bean = (String) project.getProperties().get("n");
        String Bean = bean.substring(0, 1).toUpperCase() + bean.substring(1);

        File controllerFile = new File(project.getProjectDir()
                , "src/main/java/xd/app/controller/" + Bean + "Controller.java");
        File daoFile = new File(project.getProjectDir()
                , "src/main/java/xd/app/dao/" + Bean + "Repository.java");

        create(controllerFile, "controller.txt", bean, Bean);
        create(daoFile, "./dao.txt", bean, Bean);
    }

    private void create(File dest, String template, String bean, String Bean) throws IOException {
        if (dest.exists()) {
            System.out.println("file exists:" + dest.getName());
            return;
        }
        System.out.println("start to create :" + dest);
        try (Scanner scanner = new Scanner(new FileInputStream(
                new File(getProject().getProjectDir(), "buildSrc/src/main/groovy/" + template)
        ))) {
            StringBuilder sb = new StringBuilder();
            while (scanner.hasNextLine()) {
                sb.append(scanner.nextLine()).append("\n");
            }
            if (!dest.createNewFile()) {
                System.out.println("can not create new file");
                return;
            }
            String content = sb.toString().replaceAll("&bean&", bean
            ).replaceAll("&Bean&", Bean);

            try (FileWriter fileWriter = new FileWriter(dest)) {
                fileWriter.write(content);
                fileWriter.flush();
            }
        }
    }
}
